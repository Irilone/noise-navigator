
interface TechniquesHeaderProps {
  title: string;
  description: string;
}

const TechniquesHeader = ({ title, description }: TechniquesHeaderProps) => {
  return (
    <div className="space-y-2 text-center">
      <h2 className="text-3xl font-bold tracking-tighter">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default TechniquesHeader;
