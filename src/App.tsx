import { useState } from 'react';
import { MapComponent } from './components/Map';
import { BranchDetail } from './components/BranchDetail';
import { Branch, RouteStats } from './types';
import { Menu, Info } from 'lucide-react';

function App() {
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [routingEnabled, setRoutingEnabled] = useState(false);
    const [routeStats, setRouteStats] = useState<RouteStats | null>(null);
    const [showWelcome, setShowWelcome] = useState(true);

    const handleBranchSelect = (branch: Branch) => {
        setSelectedBranch(branch);
        setRoutingEnabled(false);
        setRouteStats(null);
        setShowWelcome(false);
    };

    const handleRouteClick = () => {
        if (routingEnabled) {
            setRoutingEnabled(false);
            setRouteStats(null);
        } else {
            setRoutingEnabled(true);
        }
    };

    const handleRouteFound = (stats: RouteStats) => {
        setRouteStats(stats);
    };

    return (
        <div className="flex h-screen w-screen bg-gray-100 overflow-hidden relative">
            {/* Header / Overlay */}
            <div className="absolute top-2 md:top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm px-3 md:px-6 py-2 md:py-3 rounded-full shadow-lg flex items-center gap-2 md:gap-3 border border-gray-200">
                <img
                    src="https://www.innogy.cz/images/logo-innogy.svg"
                    alt="innogy"
                    className="h-6 md:h-8 w-auto"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
                <span className="font-bold text-gray-800 text-sm md:text-base hidden sm:inline">Mapa Poboček</span>
            </div>

            <MapComponent
                onBranchSelect={handleBranchSelect}
                selectedBranch={selectedBranch}
                routingEnabled={routingEnabled}
                onRouteFound={handleRouteFound}
            />

            <BranchDetail
                branch={selectedBranch}
                onClose={() => {
                    setSelectedBranch(null);
                    setRoutingEnabled(false);
                    setRouteStats(null);
                }}
                onRouteClick={handleRouteClick}
                routeActive={routingEnabled}
                routeStats={routeStats}
            />

            {/* Welcome / Start Info */}
            {showWelcome && !selectedBranch && (
                <div className="fixed bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-[1000] bg-white p-3 md:p-4 rounded-xl shadow-xl max-w-md w-full mx-3 md:mx-4 border-l-4 border-green-500 animate-slide-up">
                    <div className="flex items-start gap-3 md:gap-4">
                        <div className="p-1.5 md:p-2 bg-green-100 rounded-full text-green-600 shrink-0">
                            <Info size={20} className="md:w-6 md:h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 text-base md:text-lg">Vítejte!</h3>
                            <p className="text-gray-600 mt-1 text-sm md:text-base">
                                Vyberte pobočku na mapě pro zobrazení detailů a plánování trasy z vaší adresy v Ostravě.
                            </p>
                            <div className="mt-2 md:mt-3 flex items-center gap-2 text-xs md:text-sm text-gray-400">
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full border border-white shadow-sm shrink-0"></div>
                                <span className="truncate">Vaše poloha: Plynární 2748/6</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowWelcome(false)}
                            className="text-gray-400 hover:text-gray-600 shrink-0"
                        >
                            <Menu size={18} className="md:w-5 md:h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
