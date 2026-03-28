import { UtensilsCrossed, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      className="mt-auto"
      style={{
        background: 'white',
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                <UtensilsCrossed size={14} className="text-white" />
              </div>
              <span className="font-bold text-gray-800">MealMuse</span>
            </div>
            <p className="text-xs text-gray-400 text-center md:text-left">
              Your personal meal planning companion
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>MealMuse © 2026</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open('https://github.com/vukasinriznic/recipe-app', '_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 transition-all hover:bg-gray-50"
            >
              <Github size={16} />
              <span className="hidden md:block">GitHub</span>
            </button>
            <button
              onClick={() => window.open('https://linkedin.com/in/vukasinriznic', '_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #0077b5, #005885)' }}
            >
              <Linkedin size={16} />
              <span className="hidden md:block">LinkedIn</span>
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;