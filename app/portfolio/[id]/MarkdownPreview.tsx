'use client';

import dynamic from 'next/dynamic';

type MarkdownPreviewProps = {
  source: string;
};

const MDPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

export default function MarkdownPreview({ source }: MarkdownPreviewProps) {
  return <MDPreview source={source} />;
}
