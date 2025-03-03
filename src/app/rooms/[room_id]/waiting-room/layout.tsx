import { ReactNode } from 'react';

type RoomLayoutProps = {
  children: ReactNode;
};

export default function RoomLayout({ children }: RoomLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}