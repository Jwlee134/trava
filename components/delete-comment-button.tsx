import { useFormStatus } from "react-dom";

export default function DeleteCommentButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`btn btn-block btn-error ${pending ? "btn-disabled" : ""}`}
    >
      {pending ? (
        <>
          <span className="loading loading-spinner"></span> Deleting
        </>
      ) : (
        "Delete"
      )}
    </button>
  );
}
