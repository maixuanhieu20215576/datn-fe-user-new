import React from "react";
import Pagination from "../../components/ui/pagination/Pagination";

interface Comment {
  _id: string;
  userId: string;
  userName: string;
  avatar: string;
  content: string;
  rating: number;
  createdAt: string;
}

interface CommentSectionProps {
  comments: Comment[];
  isLoadingComments: boolean;
  newComment: string;
  setNewComment: (value: string) => void;
  rating: number;
  setRating: (value: number) => void;
  handleSubmitComment: (e: React.FormEvent) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  isLoadingComments,
  newComment,
  setNewComment,
  rating,
  setRating,
  handleSubmitComment,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Đánh giá và nhận xét
      </h3>

      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Đánh giá của bạn
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-2xl focus:outline-none"
              >
                {star <= rating ? "⭐" : "☆"}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300"
            rows={4}
            placeholder="Nhập nhận xét của bạn..."
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Gửi nhận xét
        </button>
      </form>

      <div className="space-y-4">
        {isLoadingComments ? (
          <div className="text-center py-4">Đang tải bình luận...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            Chưa có bình luận nào
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <div key={comment._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <img
                    src={comment.avatar}
                    alt={comment.userName}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      {comment.userName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(comment.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {comment.content}
                </p>
              </div>
            ))}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
