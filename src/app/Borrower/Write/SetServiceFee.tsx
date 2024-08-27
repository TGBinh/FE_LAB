import React, { useState } from 'react';
import { publicClient, walletClient } from '../../../client';
import { contract } from '../BorrowerAbi';
import { useAccount } from 'wagmi';
import { Address } from 'viem';
import '../../CollateralManager/Function.css';

const SetServiceFee = () => {
    const [serviceFee, setServiceFee] = useState<string>('');
    const [error, setError] = useState<string | null>(null); 
    const account = useAccount();

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!serviceFee) {
            setError('Please provide a service fee.');
            return;
        }

        const fee = BigInt(serviceFee);

        if (fee < 0) {
            setError('Please provide a valid service fee.');
            return;
        }

        try {
            const { request } = await publicClient.simulateContract({
                abi: contract.abi,
                address: contract.address as Address,
                functionName: 'setServiceFee',
                args: [fee],
                account: account.address as Address,
            });

            const hash = await walletClient.writeContract(request);
            console.log('Transaction hash:', hash);
            setError(null); 
        } catch (error) {
            console.error('Error calling setServiceFee:', error);
            setError('Failed to set service fee.'); 
        }
    }

    return (
        <div className="form-container">
            <h2>Set Service Fee</h2>
            <form onSubmit={submit}>
                <div className="input-container">
                    <label htmlFor="serviceFee">Service Fee (in wei):</label>
                    <input 
                        type="number" 
                        id="serviceFee" 
                        name="serviceFee" 
                        value={serviceFee} 
                        onChange={(e) => setServiceFee(e.target.value)} 
                        //placeholder="Enter service fee"
                    />
                </div>
                <button type="submit" className="submit-button">Set Service Fee</button>
            </form>
            {error && <p className="error">{error}</p>} {}
        </div>
    );
}

export default SetServiceFee;
