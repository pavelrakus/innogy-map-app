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
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-3 border border-gray-200">
                <img
                    src="https://www.innogy.cz/images/logo-innogy.svg"
                    alt="innogy"
                    className="h-8 w-auto"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
                <span className="font-bold text-gray-800 hidden sm:inline">Mapa Poboček</span>
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
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[1000] bg-white p-4 rounded-xl shadow-xl max-w-md w-full mx-4 border-l-4 border-green-500 animate-slide-up">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-green-100 rounded-full text-green-600">
                            <Info size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">Vítejte!</h3>
                            <p className="text-gray-600 mt-1">
                                Vyberte pobočku na mapě pro zobrazení detailů a plánování trasy z vaší adresy v Ostravě.
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                                <div className="w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm"></div>
                                <span>Vaše poloha: Plynární 2748/6</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowWelcome(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
