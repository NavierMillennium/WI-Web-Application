import { useState, useEffect } from "react";

interface User {
    id: number,
    username: string,
    fullName: string

}

interface Comment {
    id: number,
    body: string,
    postId: number,
    likes: number,
    user: User
}
interface Response{
    comments: Comment[]
}

export function Komentarz(props: Comment) {
    const [likes, setLikes] = useState<number>(props.likes)

    const likeUp = () => setLikes((prev => prev + 1))
    const likeDown = () => setLikes((prev => prev > 0 ? prev - 1 : 0))

    return (
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "12px",
                maxWidth: "400px",
                marginBottom: "12px",
                backgroundColor: "#fafafa"
            }}
        >
            <div style={{ marginBottom: "6px" }}>
                <strong>{props.user.fullName}</strong>{" "}
                <span style={{ color: "#666" }}>@{props.user.username}</span>
            </div>

            <p style={{ margin: "8px 0" }}>{props.body}</p>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}
            >
                <button onClick={likeUp}>👍</button>
                <span>{likes}</span>
                <button onClick={likeDown}>👎</button>
            </div>

            <small style={{ color: "#999" }}>
                Komentarz #{props.id} • Post #{props.postId}
            </small>
        </div>
    );
}

export function Komentarze() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("https://dummyjson.com/comments")
            .then(res => {
                if (!res.ok) {
                    throw new Error("Błąd pobierania danych");
                }
                return res.json();
            })
            .then((data: Response) => {
                setComments(data.comments);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []); // ⬅️ wykona się RAZ po zamontowaniu komponentu

    if (loading) return <p>Ładowanie...</p>;
    if (error) return <p>Błąd: {error}</p>;

    return (
        <ul>
            {comments.map(c => (
                <Komentarz key={c.id} {...c} />
            ))}
        </ul>
    );
}
