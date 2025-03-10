import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
} from "lexical";
import {
  FaBold,
  FaItalic,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
} from "react-icons/fa";
export const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="toolbar">
      <div className="toolbar d-flex gap-2 p-2 border rounded bg-light shadow-sm">
        {/* Bold */}
        <button
          type="button"
          className={"btn btn-light"}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        >
          <FaBold />
        </button>
        <button type="button" className="btn btn-light" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
          <FaItalic />
        </button>
        <button type="button" className="btn btn-light" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}>
          <FaAlignLeft />
        </button>
        <button type="button" className="btn btn-light" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}>
          <FaAlignCenter />
        </button>
        <button type="button" className="btn btn-light" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}>
          <FaAlignRight />
        </button>
        <button type="button" className="btn btn-light" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")}>
          <FaAlignJustify />
        </button>

      </div>
    </div>
  );
};  