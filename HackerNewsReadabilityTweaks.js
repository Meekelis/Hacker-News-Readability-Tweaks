// ==UserScript==
// @name         Hacker News Readability Tweaks
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Improve Hacker News Readability
// @author       Martin Gladdish & Kazimieras Mikelis
// @match        https://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @license      MIT
// ==/UserScript==

const tampermonkeyScript = function() {
    'use strict';

    document.head.insertAdjacentHTML("beforeend", `<style>
      :root {
        --colour-hn-orange: #ff6600;
        --colour-hn-orange-pale: rgba(255, 102, 0, 0.05);
        --gutter: 0.5rem;
        --border-radius: 8px;
        --colour-greyed-out: #757575;
      }

      /* Reset font everywhere */
      html, body, td, .title, .comment, .default {
        font-family: 'Helvetica Neue', 'Helvetica', 'Arial Neue', 'Arial', sans-serif;
      }

      html, body {
        margin-top: 0;
      }

      body {
        padding: 0;
        margin: 0;
      }

      body, td, .title, .pagetop, .comment {
        font-size: 1rem;
        line-height: 1.4;
      }

      .votelinks, html[op='news'] .title {
        vertical-align: inherit;
      }
      
      .comment-tree .votelinks,
        html[op='threads'] .votelinks,
        html[op='newcomments'] .votelinks{
        vertical-align: top;
      }

      span.titleline {
        font-size: 1rem;
        line-height: 1.2;
        margin-top: var(--gutter);
        margin-bottom: var(--gutter);
        display: block;
        font-weight: bold;
      }
      
      html[op='item'] span.titleline {
        font-size: 2.2rem;
      }

      html[op='news']        #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
      html[op='newest']      #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
      html[op='ask']         #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
      html[op='newcomments'] #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
      html[op='shownew']     #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1), 
      html[op='submitted']   #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
      html[op='favorites']   #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(2),
      html[op='front']       #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(2),
      html[op='show']        #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(2) {
         margin-left: var(--gutter);
      }

      .sitebit.comhead {
        margin-left: var(--gutter);
      }

      .subtext, .subline {
        font-size: .75rem;
      }

      #hnmain {
        background-color: #f9f9f9;
      }

      /* Menu bar */

      #hnmain > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) {
        padding: var(--gutter);
      }
      #hnmain > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) {
        padding-right: var(--gutter) !important;
      }

      .hnname {
        font-size: 1.4em;
        font-weight: bold;
      }

      .comment, .toptext {
        max-width: 40em;
      }
      .toptext, a, a:visited {
        color: black;
      }

      a:hover {
        text-decoration: underline;
      }
      
      input {
        padding: var(--gutter);
      }

      input, textarea {
        background-color: white;
        border: 1px solid var(--colour-greyed-out);
        padding: 6px;
        border-radius: var(--border-radius);
      }

      input[type='button'] {
        cursor: pointer;
      }   

      /* Custom styles added via javascript */
      .downvoted .commtext {
        color: var(--color-greyed-out);
        text-decoration: line-through;
      }
      
      .quote {
        margin: 16px;
        border: 1px solid var(--colour-hn-orange-pale);
        border-left: 6px solid var(--colour-hn-orange);
        padding: 16px;
        color: var(--colour-greyed-out);
        background-color: var(--colour-hn-orange-pale);
        border-radius: var(--border-radius);
        font-size: 0.9em;
      }
      
      .hidden {
        display: none;
      }

      .showComment a, .hideComment, .hideComment:link, .hideComment:visited {
        color: var(--colour-hn-orange);
        text-decoration: underline;
      }
      .hideComment {
        margin-left: var(--gutter);
      }

      .votearrow {
        background: var(--colour-hn-orange-pale);
        border-radius: var(--border-radius);
        min-width: 24px;
        min-height: 24px;
        margin: 0px 8px 0px 8px;
      } 
      
      .votearrow:after {
        content: \"⇧\";
        display: block;
        line-height: 1.45;
        color: var(--colour-hn-orange);
        font-size: 16px;
        
     }

    </style>`);

    const comments = document.querySelectorAll('.commtext');
    comments.forEach(e => {
        if (!e.classList.contains('c00')) {
            e.parentElement.classList.add('downvoted');
        }
    });

    let node = null;
    let nodes = [];
    const ps = document.evaluate("//p[starts-with(., '>')]", document.body)
    while (node = ps.iterateNext()) {
        nodes.push(node);
    }
    const spans = document.evaluate("//span[starts-with(., '>')]", document.body)
    while (node = spans.iterateNext()) {
        nodes.push(node);
    }
    nodes.forEach((n) => {
        const textNode = Array.from(n.childNodes).find((n) => n.nodeType === Node.TEXT_NODE);
        if (textNode) {
            const p = document.createElement('p');
            p.classList.add('quote');
            p.innerText = textNode.data.replace(">", "");
            n.firstChild.replaceWith(p);
        } else {
            n.classList.add('quote');
            n.innerText = n.innerText.replace(">", "");
        }
    });
}

tampermonkeyScript();
