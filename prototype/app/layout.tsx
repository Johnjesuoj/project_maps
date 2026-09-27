export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, system-ui, sans-serif", background: "#F8FAF6", color: "#14231A" }}>
        {children}
      </body>
    </html>
  );
}
