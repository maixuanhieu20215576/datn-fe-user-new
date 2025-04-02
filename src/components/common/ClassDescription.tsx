interface ClassDescriptionProps {
    language: string;
}

export default function ClassDescription({ language }: ClassDescriptionProps) {
    switch (language) {
        case "Japanese":
            return (
                <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h1 className="text-xl font-semibold mb-4 text-blue-500">Mô tả khóa học</h1>
                    <div className="prose max-w-none dark:prose-invert">
                        <p className="text-lg mb-4 text-gray-900 dark:text-white">🌸 Khóa học Tiếng Nhật Cơ Bản – Dành cho Người Mới Bắt Đầu 🌸</p>

                        <p className="mb-4 text-gray-700 dark:text-gray-300">Bạn muốn bắt đầu hành trình chinh phục tiếng Nhật nhưng chưa biết bắt đầu từ đâu? Khóa học Tiếng Nhật Cơ Bản chính là lựa chọn lý tưởng dành cho bạn!</p>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">📘 Nội dung khóa học:</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                                <li>Làm quen với bảng chữ cái Hiragana, Katakana</li>
                                <li>Ngữ pháp và từ vựng cơ bản dùng trong đời sống hằng ngày</li>
                                <li>Giao tiếp đơn giản: chào hỏi, giới thiệu bản thân, hỏi đường,...</li>
                                <li>Luyện nghe – nói – đọc – viết với phương pháp học hiện đại, dễ hiểu</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">💡 Phù hợp với:</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                                <li>Người chưa từng học tiếng Nhật</li>
                                <li>Học sinh, sinh viên, người đi làm muốn học tiếng Nhật từ con số 0</li>
                                <li>Những ai yêu thích văn hóa Nhật Bản và muốn học để du học, làm việc hoặc du lịch</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">🎓 Kết quả sau khóa học:</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                                <li>Nắm vững nền tảng tiếng Nhật (trình độ tương đương N5)</li>
                                <li>Tự tin giao tiếp trong các tình huống đơn giản</li>
                                <li>Sẵn sàng để học tiếp lên các trình độ cao hơn (N4, N3...)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        case "Chinese":
            return (
                <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h1 className="text-xl font-semibold mb-4 text-blue-500">Mô tả khóa học</h1>
                    <div className="prose max-w-none dark:prose-invert">
                        <p className="text-lg mb-4 text-gray-900 dark:text-white">🀄 Khóa học Tiếng Trung Cơ Bản – Dành cho Người Mới Bắt Đầu 🀄</p>

                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Bạn yêu thích văn hóa Trung Hoa và muốn học ngôn ngữ phổ biến thứ hai trên thế giới? Khóa học Tiếng Trung Cơ Bản sẽ giúp bạn tiếp cận ngôn ngữ này một cách dễ dàng và hiệu quả!
                        </p>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">📘 Nội dung khóa học:</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                                <li>Làm quen với hệ thống Pinyin và thanh điệu trong tiếng Trung</li>
                                <li>Học từ vựng và cấu trúc câu cơ bản</li>
                                <li>Luyện nghe – nói – đọc – viết với chủ đề thường gặp: chào hỏi, giới thiệu, mua sắm,...</li>
                                <li>Tiếp cận chữ Hán (Hanzi) một cách khoa học, dễ nhớ</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">💡 Phù hợp với:</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                                <li>Người mới bắt đầu học tiếng Trung</li>
                                <li>Người học để đi du học, du lịch hoặc làm việc với đối tác Trung Quốc</li>
                                <li>Người yêu thích phim ảnh, âm nhạc hoặc văn hóa Trung Hoa</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">🎓 Kết quả sau khóa học:</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                                <li>Giao tiếp cơ bản với người Trung Quốc trong đời sống hằng ngày</li>
                                <li>Nắm vững phát âm, thanh điệu và một số chữ Hán phổ biến</li>
                                <li>Sẵn sàng học tiếp lên trình độ HSK 2 – HSK 3</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        case "French":
            return (
                <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h1 className="text-xl font-semibold mb-4 text-indigo-500">Mô tả khóa học</h1>
                    <div className="prose max-w-none dark:prose-invert">
                        <p className="text-lg mb-4 text-gray-900 dark:text-white">🇫🇷 Khóa học Tiếng Pháp Cơ Bản – Cho Người Mới Bắt Đầu 🇫🇷</p>

                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Bạn muốn học tiếng Pháp – ngôn ngữ của tình yêu, nghệ thuật và văn hóa? Khóa học Tiếng Pháp Cơ Bản sẽ giúp bạn xây dựng nền tảng vững chắc để bắt đầu hành trình khám phá ngôn ngữ tuyệt vời này.
                        </p>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">📘 Nội dung khóa học:</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                                <li>Làm quen với bảng chữ cái tiếng Pháp và cách phát âm</li>
                                <li>Ngữ pháp và từ vựng cơ bản theo các chủ đề hàng ngày</li>
                                <li>Giao tiếp đơn giản: giới thiệu bản thân, hỏi đường, mua sắm,...</li>
                                <li>Luyện nghe – nói – đọc – viết theo phương pháp phản xạ tự nhiên</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">💡 Phù hợp với:</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                                <li>Người chưa từng học tiếng Pháp</li>
                                <li>Người muốn học để du học, làm việc tại các nước nói tiếng Pháp</li>
                                <li>Người yêu thích văn hóa, âm nhạc, ẩm thực Pháp</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">🎓 Kết quả sau khóa học:</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                                <li>Nắm được nền tảng tiếng Pháp tương đương trình độ A1</li>
                                <li>Tự tin giao tiếp đơn giản trong các tình huống thường gặp</li>
                                <li>Sẵn sàng học tiếp lên trình độ A2 – B1 theo khung CEFR</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        case "English":
            return (
                <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h1 className="text-xl font-semibold mb-4 text-green-500">Mô tả khóa học</h1>
                    <div className="prose max-w-none dark:prose-invert">
                        <p className="text-lg mb-4 text-gray-900 dark:text-white">🇬🇧 Khóa học Tiếng Anh Cơ Bản – Dành cho Người Mới Bắt Đầu 🇬🇧</p>

                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Bạn muốn cải thiện khả năng tiếng Anh để học tập, làm việc hay giao tiếp hằng ngày? Khóa học Tiếng Anh Cơ Bản sẽ giúp bạn xây dựng nền tảng vững chắc để tự tin sử dụng tiếng Anh trong cuộc sống.
                        </p>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">📘 Nội dung khóa học:</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                                <li>Học phát âm chuẩn và làm quen với bảng chữ cái tiếng Anh</li>
                                <li>Ngữ pháp và từ vựng cơ bản: thì hiện tại, giới từ, danh – động – tính từ...</li>
                                <li>Giao tiếp thông dụng: giới thiệu, hỏi thăm, mua sắm, đặt món,...</li>
                                <li>Luyện nghe – nói – đọc – viết một cách bài bản và dễ tiếp thu</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">💡 Phù hợp với:</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                                <li>Người mới bắt đầu hoặc mất gốc tiếng Anh</li>
                                <li>Người cần tiếng Anh để du học, đi làm hoặc phỏng vấn</li>
                                <li>Người muốn tự tin giao tiếp với người nước ngoài</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">🎓 Kết quả sau khóa học:</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                                <li>Nắm vững kiến thức tiếng Anh cơ bản tương đương trình độ A1 – A2</li>
                                <li>Giao tiếp tự nhiên trong các tình huống thông dụng</li>
                                <li>Sẵn sàng học tiếp lên trình độ B1 – B2 hoặc luyện thi TOEIC, IELTS</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        default:
            return (
                <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h1 className="text-xl font-semibold mb-4 text-emerald-500">Giới thiệu chung</h1>
                    <div className="prose max-w-none dark:prose-invert">
                        <p className="text-lg mb-4 text-gray-900 dark:text-white">🌍 Học Ngoại Ngữ – Chìa Khóa Mở Rộng Cơ Hội Toàn Cầu 🌍</p>

                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Trong thế giới hội nhập, việc biết thêm một ngoại ngữ không chỉ giúp bạn giao tiếp hiệu quả mà còn mở ra nhiều cơ hội học tập, nghề nghiệp và khám phá thế giới.
                        </p>

                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Cho dù bạn đang học để du học, làm việc, đi du lịch hay đơn giản là vì đam mê, việc thành thạo một ngôn ngữ mới sẽ giúp bạn tự tin hơn, mở rộng tư duy và kết nối với nhiều nền văn hóa đa dạng.
                        </p>

                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Các khóa học tại trung tâm được thiết kế bài bản, dễ tiếp cận, phù hợp với nhiều đối tượng từ người mới bắt đầu đến người học nâng cao. Đội ngũ giảng viên tận tâm cùng phương pháp giảng dạy hiện đại sẽ đồng hành cùng bạn trên hành trình chinh phục ngoại ngữ một cách hiệu quả và đầy cảm hứng.
                        </p>
                    </div>
                </div>
            )

    }
}