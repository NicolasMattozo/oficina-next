"use client"

export default function InputField({ label, name, register, error, type = "text", placeholder }) {
  return (
            <div className="flex items-center gap-4 w-full">
            <label 
                className="text-sm font-medium text-slate-700 w-1/4" // Define uma largura fixa para o label
                htmlFor={name}
            >
                {label}
            </label>
            
            <div className="flex flex-col gap-1.5 flex-1">
                <input
                id={name}
                type={type}
                placeholder={placeholder}
                {...register(name)}
                className={`
                    w-full px-3 py-2 bg-white border rounded-lg text-slate-900 shadow-sm transition-all duration-200
                    placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-offset-1
                    ${error 
                    ? "border-red-500 focus:ring-red-200 focus:border-red-500" 
                    : "border-slate-300 focus:ring-blue-100 focus:border-blue-500"
                    }
                `}
                />

                {error && (
                <span className="flex items-center gap-1 text-xs font-medium text-red-500">
                    <span className="w-1 h-1 rounded-full bg-red-500" />
                    {error.message}
                </span>
                )}
            </div>
            </div>
  );
}
