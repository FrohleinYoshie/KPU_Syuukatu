import Link from 'next/link';

interface DataEntry {
  id: string;
  company_name: string;
  job_type?: string;
  test_type?: string;
  created_at: string;
  users_syukatu: {
    name: string;
  };
}

interface LatestInfoTabProps {
  title: string;
  entries: DataEntry[];
  registerPath: string;
  viewPath: string;
  isEmpty: boolean;
  emptyMessage: string;
  fieldToShow?: 'job_type' | 'test_type';
}

export default function LatestInfoTab({
  title,
  entries,
  registerPath,
  viewPath,
  isEmpty,
  emptyMessage,
  fieldToShow = 'job_type'
}: LatestInfoTabProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  };

  return (
    <div className="latest-content">
      <div className="latest-header">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Link href={registerPath} className="dashboard-add-button">
          新規登録
        </Link>
      </div>
      
      {!isEmpty ? (
        <div className="latest-items">
          {entries.map(entry => (
            <Link href={`${viewPath}/${entry.id}`} key={entry.id} className="latest-item">
              <div className="flex justify-between items-center">
                <div className="latest-info">
                  <h3 className="font-medium">{entry.company_name}</h3>
                  <p className="text-sm">
                    {entry[fieldToShow as keyof typeof entry] || entry.job_type} | {entry.users_syukatu.name}
                  </p>
                </div>
                <div className="latest-date">
                  {formatDate(entry.created_at)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}