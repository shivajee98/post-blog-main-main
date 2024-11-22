import React from "react";
import { Link } from "react-router-dom";

const SeeArticles = ({ articles }) => {
    const defaultImage =
        "https://img.freepik.com/free-vector/blog-articles-abstract-concept-illustration_335657-4934.jpg?w=826&t=st=1725181824~exp=1725182424~hmac=31d32441c825ea96bc3d2d3620aa7fd7ba02c0a76c76f1a6c2e0aa4064c64be9";

    const extractImage = (html) => {
        const regex = /<img[^>]+src="([^">]+)"/;
        const match = html.match(regex);
        return match ? match[1] : defaultImage;
    };

    return (
        <div className="flex flex-col items-center p-4 bg-gray-900">
            {articles.map((article) => (
                <div
                    key={article._id}
                    className="w-full max-w-3xl bg-gray-800 rounded-lg overflow-hidden mb-6 shadow-lg transition-transform duration-300 transform hover:scale-[1.02] hover:shadow-sky-400/50 border border-gray-700"
                >
                    <div className="flex items-start">
                        <img
                            src={extractImage(article.paragraph)}
                            alt={article.title}
                            className="w-24 h-24 object-cover rounded-md m-4"
                        />
                        <div className="flex-1 p-4">
                            <h2 className="text-xl font-bold text-white mb-2 truncate">
                                {article.title}
                            </h2>
                            <p
                                className="text-sm text-gray-300 mb-4 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: article.paragraph.slice(0, 120) + "...",
                                }}
                            />
                            <Link
                                to={`/blogs/${article._id}`}
                                className="text-sky-400 font-semibold hover:underline mr-4"
                            >
                                Read more
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SeeArticles;
