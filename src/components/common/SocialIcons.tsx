export function FacebookIcon({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function InstagramIcon({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5a5 5 0 110 10 5 5 0 010-10zm6.5-1.5a1.5 1.5 0 11-3.001.001A1.5 1.5 0 0118.5 5.5z"
      />
      <circle cx="12" cy="12" r="3.2" fill="currentColor" />
    </svg>
  );
}

export function TwitterIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.6 8.6 0 01-2.72 1.04 4.28 4.28 0 00-7.29 3.9A12.14 12.14 0 013 4.79a4.28 4.28 0 001.32 5.71 4.23 4.23 0 01-1.94-.54v.05a4.28 4.28 0 003.43 4.2 4.29 4.29 0 01-1.93.07 4.29 4.29 0 004 2.97A8.6 8.6 0 012 19.54 12.12 12.12 0 008.29 21c7.55 0 11.68-6.26 11.68-11.68v-.53A8.36 8.36 0 0022.46 6z"
      />
    </svg>
  );
}

export function YoutubeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.8zM9.5 15.5v-7l6 3.5-6 3.5z"
      />
    </svg>
  );
}

export function LinkedinIcon({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.55v-5.57c0-1.33-.48-2.24-1.99-2.24-1.08 0-1.72.72-2.01 1.42-.1.25-.13.6-.13.95v5.44H9.22V9.65h3.55v1.39c.43-.66 1.2-1.61 2.92-1.61 2.14 0 3.74 1.4 3.74 4.4v5.62zM5.34 8.09c-1.14 0-1.92-.76-1.92-1.71 0-.96.78-1.71 1.96-1.71 1.19 0 1.91.75 1.94 1.71 0 .95-.75 1.71-1.98 1.71zM7 20.45H3.76V9.65H7v10.8z"
      />
    </svg>
  );
}
