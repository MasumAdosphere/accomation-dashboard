// src/extensions/InstagramEmbed.jsx
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { useEffect } from "react";

interface InstagramEmbedAttrs {
  url: string | null;
}

// Component props interface
interface InstagramEmbedComponentProps {
  node: {
    attrs: InstagramEmbedAttrs;
  };
}

const InstagramEmbedComponent: React.FC<InstagramEmbedComponentProps> = ({
  node,
}) => {
  const { url } = node.attrs;

  useEffect(() => {
    //@ts-ignore
    if (!window.instgrm) {
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        //@ts-ignore
        window.instgrm.Embeds.process();
      };
    } else {
      // If script already exists, just process new embeds
      setTimeout(() => {
        //@ts-ignore
        window.instgrm?.Embeds.process();
      }, 0);
    }
  }, [url]);

  if (!url || !url.includes("instagram.com")) {
    return (
      <NodeViewWrapper className="instagram-embed-wrapper">
        <div
          style={{ padding: "1rem", border: "1px dashed #ccc", color: "red" }}
        >
          Invalid Instagram URL
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="instagram-embed-wrapper">
      <div
        data-instagram-embed
        style={{
          maxWidth: "550px",
          textAlign: "center",
        }}
      >
        <blockquote className="instagram-media" data-instgrm-captioned>
          <a href={url} target="_blank" rel="noopener noreferrer"></a>
        </blockquote>
      </div>
    </NodeViewWrapper>
  );
};

export const InstagramEmbed = Node.create({
  name: "instagramEmbed",
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
    };
  },

  parseHTML() {
    return [
      {
        tag: "blockquote.instagram-media",
        getAttrs: (element) => {
          const anchor = element.querySelector("a");
          const href = anchor ? anchor.href : null;
          return { url: href };
        },
      },
      {
        tag: "div[data-instagram-embed]",
        getAttrs: (element) => ({
          url: element.getAttribute("data-url"),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-instagram-embed": "" }),
    ];
  },
  //@ts-ignore
  addCommands() {
    return {
      setInstagramEmbed:
        //@ts-ignore
          (options) =>//@ts-ignore
          ({ commands }) => {
            const url = options.url.trim();

            if (!url.includes("instagram.com")) {
              console.warn("Invalid Instagram URL:", url);
              return false;
            }

            return commands.insertContent({
              type: this.name,
              attrs: { url },
            });
          },
    };
  },

  addNodeView() {
    //@ts-ignore
    return ReactNodeViewRenderer(InstagramEmbedComponent);
  },
});
