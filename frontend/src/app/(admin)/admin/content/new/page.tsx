import ContentEditorForm from '@/components/ContentEditorForm';

export const metadata = {
  title: 'Create Content',
};

export default function AdminNewContentPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <ContentEditorForm isEdit={false} />
    </div>
  );
}
