"use client";



interface TermsProps {
  terms: string[];
  cardColor?:string
}

export default function TermsAndConditions({ terms,cardColor = "#3b2a26" }: TermsProps) {


  return (
    <div className="mx-6 mt-6 mb-0 p-5  rounded-t-2xl bg-white shadow-sm" style={{background:cardColor}}>
      
      {/* Header */}
      
        <h2 className="text-lg font-semibold text-white">
          Terms & Conditions
        </h2>
 
   

      {/* Content */}

        <div className="mt-4 space-y-2">
          {terms.map((term, index) => (
            <p key={index} className="text-sm text-white">
              • {term}
            </p>
          ))}
        </div>

    </div>
  );
}
