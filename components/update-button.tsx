import { useFormStatus } from "react-dom";

export default function UpdateButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`btn btn-block ${pending ? "btn-disabled" : ""}`}
    >
      {pending ? (
        <>
          <span className="loading loading-spinner"></span> Updating
        </>
      ) : (
        "Update"
      )}
    </button>
  );
}
