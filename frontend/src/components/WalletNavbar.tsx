import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import handleLogout from '../utils/handleLogout';
import { useAuth } from './Layout';
import { useNavigate } from 'react-router-dom';

export function WalletNavbar() {
    const { connected, publicKey } = useWallet();
    const auth = useAuth();
    const navigation = useNavigate()

    return (
        <div className="flex justify-between items-center p-4 bg-[#0A0A0A] border-b border-gray-800 relative z-40">
            <div className="flex items-center space-x-4">
                {connected && publicKey && (
                    <span className="text-sm text-gray-400">
                        Connected: {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}
                    </span>
                )}
            </div>
            <div className="flex items-center space-x-4">
                <WalletMultiButton className="!bg-[#6C45FF] !rounded-lg !text-white !font-semibold !py-2 !px-4 !transition-colors !duration-300 !text-sm" />
                <button
              className="relative flex items-center justify-center gap-2 bg-black px-6 py-3 text-white font-medium transition-all duration-200 hover:bg-gray-800"
              onClick={() => {
                handleLogout()
                auth?.setAuthStatus(null)
                navigation("/")

              }}>Logout</button>
            </div>
        </div>
    );
}
