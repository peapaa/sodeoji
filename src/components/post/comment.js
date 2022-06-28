import CommentForm from "./comment-form";
import Vote from "./vote";

const Comment = ({
    data,
    comment,
    replies,
    user,
    addComment,
    updateComment,
    deleteComment,
    activeComment,
    setActiveComment,
    parentId
}) => {
    const canReply = Boolean(user?.user_id);
    const canEdit = user?.user_id === comment.userId;
    const canDelete = user?.user_id === comment.userId;
    const isEditing =
        activeComment &&
        activeComment.id === comment.id &&
        activeComment.type === "editing";
    const isReplying =
        activeComment &&
        activeComment.type === "replying" &&
        activeComment.id === comment.id;
    const replyId = parentId ? parentId : comment.id;
    const date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(comment.create_date);

    // console.log(replies);
    const getReplies = (commentId) => {
        if (data) return (data
            .filter(data => data.parentId === commentId)
            .sort(
                (a, b) => {
                    if (b.vote_numbers !== a.vote_numbers) return b.vote_numbers - a.vote_numbers;
                    else return new Date(a.create_date).getTime() - new Date(b.create_date).getTime();
                }
            ));
    };

    return (
        <div key={comment.id} className="comment">
            <div className="comment-image-container">
                <img src={comment?.avatar} className="rounded-full w-thanh" alt="" />

                <div className="font-bold flex flex-row justify-center items-center">
                    <Vote user={user} content={comment} linkdb={`Posts/${comment.postId}/comments`} />
                </div>
            </div>

            <div className="comment-right-part">
                <div className="comment-content">
                    <div className="comment-author">{comment.username}</div>
                    <div className="flex items-center">
                        <div className="text-xs">{date}</div>
                    </div>
                </div>
                {!isEditing && <div className="comment-text">{comment.body}</div>}
                {isEditing && (
                    <CommentForm
                        submitLabel="Chỉnh sửa"
                        hasCancelButton
                        initialText={comment.body}
                        handleSubmit={(text) => updateComment(text, comment.id)}
                        handleCancel={() => {
                            setActiveComment(null);
                        }}
                    />
                )}

                <div className="comment-actions">
                    {canReply &&
                        <div className="comment-action"
                            onClick={() =>
                                setActiveComment({ id: comment.id, type: "replying" })
                            }>Trả lời</div>}
                    {canEdit && (
                        <div className="comment-action"
                            onClick={() => setActiveComment({ id: comment.id, type: "editing" })
                            }>Chỉnh sửa</div>
                    )}
                    {canDelete &&
                        <div className="comment-action"
                            onClick={() => deleteComment(comment.id)}>Xóa</div>}
                </div>
                {isReplying && (
                    <CommentForm
                        submitLabel="Trả lời"
                        hasCancelButton
                        handleSubmit={(text) => addComment(text, replyId)}
                        handleCancel={() => {
                            setActiveComment(null);
                        }}
                    />
                )}
                {replies?.length > 0 ? (
                    <div className="replies">
                        {replies.map((reply) => (
                            <Comment
                                data={data}
                                comment={reply}
                                key={reply.id}
                                replies={getReplies(reply.id)}
                                user={user}
                                deleteComment={deleteComment}
                                activeComment={activeComment}
                                setActiveComment={setActiveComment}
                                updateComment={updateComment}
                                addComment={addComment}
                                parentId={reply.id}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        </div>


    )
};

export default Comment;