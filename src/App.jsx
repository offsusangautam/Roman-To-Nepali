import { useState } from "react";
import { Copy, ArrowRight, Languages, Type } from "lucide-react";

export default function App() {
  const [roman, setRoman] = useState("");
  const [nepali, setNepali] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const transliterate = async (text) => {
    if (!text.trim()) {
      setNepali("");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://inputtools.google.com/request?text=${encodeURIComponent(
          text
        )}&itc=ne-t-i0-und&num=1`
      );

      const data = await response.json();

      if (data[0] === "SUCCESS") {
        const converted = data[1][0][1][0];
        setNepali(converted);
      } else {
        setNepali(text);
      }
    } catch (error) {
      setNepali(text);
      console.error("Transliteration API error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setRoman(value);
    transliterate(value);
  };

  const copyToClipboard = () => {
    if (nepali) {
      navigator.clipboard.writeText(nepali);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = () => {
    setRoman("");
    setNepali("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <Languages className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Roman to Nepali Converter
              </h1>
              <p className="text-sm text-gray-600">
                Type Roman Nepali and get instant Devanagari translation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Roman Input Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Type className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Roman Input</h2>
                <p className="text-sm text-gray-600">Type in Roman Nepali</p>
              </div>
            </div>
            
            <textarea
              value={roman}
              onChange={handleChange}
              placeholder="Start typing Roman Nepali here... 
Example: 'namaste', 'kasto cha', 'tapai kaha basnu huncha'"
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl text-lg resize-none 
                         focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200
                         placeholder-gray-400 leading-relaxed"
            />
            
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>{roman.length} characters</span>
              {roman && (
                <button
                  onClick={clearAll}
                  className="text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Arrow Indicator */}
          <div className="lg:hidden flex justify-center items-center py-4">
            <div className="p-3 bg-white rounded-full shadow-lg border-2 border-blue-200">
              <ArrowRight className="w-6 h-6 text-blue-600 rotate-90 lg:rotate-0" />
            </div>
          </div>

          {/* Nepali Output Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Languages className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Nepali Output</h2>
                  <p className="text-sm text-gray-600">Devanagari script</p>
                </div>
              </div>
              
              {nepali && (
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    copied 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                  } border`}
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>

            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white/50 rounded-xl flex items-center justify-center z-10">
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-medium">Converting...</span>
                  </div>
                </div>
              )}
              
              <div
                className={`w-full h-64 p-4 border-2 rounded-xl bg-gradient-to-br from-gray-50 to-white
                           text-xl leading-relaxed overflow-auto font-['Noto Sans Devanagari'] 
                           ${nepali ? 'border-indigo-200 text-gray-800' : 'border-gray-200 text-gray-400'}
                           transition-all duration-200`}
                style={{ userSelect: "text" }}
              >
                {nepali || (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Languages className="w-12 h-12 text-gray-300 mb-3" />
                    <p>Your Nepali translation will appear here...</p>
                    <p className="text-sm mt-2">Start typing Roman Nepali on the left</p>
                  </div>
                )}
              </div>
            </div>

            {nepali && (
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>
                  {nepali.split('').length} characters • {nepali.split(/\s+/).filter(word => word.length > 0).length} words
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Tips for better results
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex gap-3">
              <span className="text-blue-500 font-bold">•</span>
              <span>Use standard Roman spelling (e.g., 'cha' not 'chha')</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-500 font-bold">•</span>
              <span>Type naturally as you would speak</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-500 font-bold">•</span>
              <span>Use spaces between words for better accuracy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}