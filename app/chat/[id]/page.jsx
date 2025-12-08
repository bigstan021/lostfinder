import ChatClient from "./ChatClient";

// This is a SERVER component (no "use client" here)
export default async function ChatPage({ params }) {
  //  params is a Promise, so we unwrap it here
  const { id } = await params;

  if (!id) {
    return (
      <div className="p-10 text-center">
        No item id provided.
      </div>
    );
  }

  // Pass the id down to the CLIENT component
  return <ChatClient itemId={id} />;
}
