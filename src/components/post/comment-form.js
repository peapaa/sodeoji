import { useState } from "react";

const CommentForm = ({
    handleSubmit,
    submitLabel,
    hasCancelButton = false,
    handleCancel,
    initialText = "" }) => {
    const [text, setText] = useState(initialText);
    const isTextareaDisable = text.length === 0;
    const onSubmit = (event) => {
        event.preventDefault();
        handleSubmit(text);
        setText("");
    };
    return (
        <form onSubmit={onSubmit}>
            <textarea
                className="comment-form-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button className={submitLabel === 'Bình luận' ? "comment-form-button" : "comment-action"} disabled={isTextareaDisable}>
                {submitLabel}
            </button>
            {hasCancelButton && (
                <button
                    type="button"
                    className="comment-action"
                    onClick={handleCancel}
                >
                    Hủy
                </button>
            )}
        </form>
    )
};

export default CommentForm;