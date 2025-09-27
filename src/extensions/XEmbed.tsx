// src/extensions/XEmbed.jsx
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, nodePasteRule } from "@tiptap/react";
import { Tweet } from "react-tweet";
import { NodeViewWrapper } from "@tiptap/react";
//@ts-ignore
const XEmbedComponent = ({ node }) => {
  const { url } = node.attrs;
  const tweet = url.split("/");
  const tweetId = tweet[tweet?.length - 1];
  const wrapperStyles = {
    display: "flex",
    padding: "10px",
    borderRadius: "8px",
  };
  if (!tweetId) {
    return (
      <NodeViewWrapper style={wrapperStyles}>
        <p style={{ color: "red", textAlign: "center" }}>Invalid Twitter URL</p>
        {url && (
          <p style={{ fontSize: "0.8em", wordBreak: "break-all" }}>{url}</p>
        )}
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper style={wrapperStyles} className="x-embed-wrapper">
      <div data-tweet-id={tweetId} data-theme="light">
        <Tweet id={tweetId} />
      </div>
    </NodeViewWrapper>
  );
};

export const XEmbed = Node.create({
  name: "xEmbed",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      url: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-url"),
        renderHTML: (attributes) => ({ "data-url": attributes.url }),
      },
      tweetId: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-x-embed]",
        getAttrs: (element) => {
          const url = element.getAttribute("data-url");
          const tweetIdMatch = url ? url.match(/\/status\/(\d+)/) : null;
          const tweetId = tweetIdMatch ? tweetIdMatch[1] : null;
          return { url, tweetId };
        },
      },
      {
        tag: "blockquote.twitter-tweet",
        getAttrs: (element) => {
          const tweetLink = element.querySelector('a[href*="/status/"]'); //@ts-ignore
          const url = tweetLink ? tweetLink.href : null;
          const tweetIdMatch = url ? url.match(/\/status\/(\d+)/) : null;
          const tweetId = tweetIdMatch ? tweetIdMatch[1] : null;
          return { url, tweetId };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-x-embed": "" })];
  },
  //@ts-ignore
  addCommands() {
    return {
      setXEmbed:
        (
          //@ts-ignore
          options 
        ) =>//@ts-ignore
        ({ commands }) => {
          let url = options.url.trim();

          // Try to extract URL from HTML if user pasted a blockquote
          if (url.includes("<blockquote")) {
            const match = url.match(
              /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/\d+/
            );
            if (match) url = match[0];
          }

          const tweetIdMatch = url.match(/\/status\/(\d+)/);
          const tweetId = tweetIdMatch ? tweetIdMatch[1] : null;

          if (!tweetId) {
            console.warn("Invalid Twitter URL:", url);
            return false;
          }

          return commands.insertContent({
            type: this.name,
            attrs: { url, tweetId },
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(XEmbedComponent);
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/(\d+)/g,
        type: this.type,
        getAttributes: (match) => {
          const url = match[0];
          const tweetId = match[1];
          return { url, tweetId };
        },
      }),
      nodePasteRule({
        find: /<blockquote class="twitter-tweet"[^>]*>[\s\S]*?<a\s+href="(https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/\d+)"[/\s\S]*?<\/blockquote>/gi,
        type: this.type,
        getAttributes: (match) => {
          const url = match[1];
          const tweetIdMatch = url.match(/\/status\/(\d+)/);
          const tweetId = tweetIdMatch ? tweetIdMatch[1] : null;
          return { url, tweetId };
        },
      }),
    ];
  },
});
