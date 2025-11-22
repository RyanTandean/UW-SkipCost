export default function WelcomeMessage({ greeting, username }) {
  const today = new Date();
  
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <h1 className="text-3xl mb-2">
        {greeting}{username ? `, ${username}` : ''}
      </h1>
      <p className="text-lg opacity-90">
        {formattedDate}
      </p>
    </>
  );
}