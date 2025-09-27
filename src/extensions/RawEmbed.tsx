
import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useEffect } from "react";

//@ts-ignore
const RawEmbedComponent = ({ node }) => {
  const { html } = node.attrs;

  useEffect(() => {//@ts-ignore
    if (window.twttr?.widgets) window.twttr.widgets.load();
    //@ts-ignore
    if (window.instgrm?.Embeds) window.instgrm.Embeds.process();
  }, []);

  return (
    <NodeViewWrapper
      as="div"
      className="embed-wrapper"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const RawEmbed = Node.create({
  name: "rawEmbed",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      html: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="raw-embed"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "raw-embed" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(RawEmbedComponent);
  },
});
