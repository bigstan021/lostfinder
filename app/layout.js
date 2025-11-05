import { Roboto } from "next/font/google";
import "./globals.css";




const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "LostFinder",
  description: "Find or report lost items easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} antialiased`}
      >
        
        {children}
       
      </body>
    </html>
  );
}
