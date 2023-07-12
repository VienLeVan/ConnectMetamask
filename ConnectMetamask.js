import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import {
    WalletConnectModal,
    useWalletConnectModal,
} from "@walletconnect/modal-react-native";

import axios from "axios";
import { providerMetadata, sessionParams } from './Config';
import { BlockchainActions } from "./src/BlockchainActions";
import { ethers, Contract } from 'ethers';
import { getType } from './src/Api/ABI/Erc20'
import { sendTransaction } from './src/MethodUtil';

//USDT
import usdtAbi from './src/abis/usdt-abi.json';
const USDT_ADDRESS = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';

const projectId = "801b302fd99f8b54bc7db7fa08c2d3c3";
const ToAddress = '0x22746588A503434fC1173af62a6Aa82159EBeD25';


const ConnectMetamask = () => {
    const [isShow, setIsShow] = useState(false);
    const { close, open, isConnected, provider, address, signer } = useWalletConnectModal();
    const [balance, setBalance] = useState(0);
    const getClientId = async () => {
        if (provider && isConnected) {
            const _clientId = await provider?.client?.core.crypto.getClientId();
            console.log("Client ID: ", _clientId);
        }
    }


    const getMaticBalance = async () => {
        let web3Provider = new ethers.providers.Web3Provider(provider);

        const balance = await web3Provider.getBalance(address);

        console.log("Matic Balance:", balance / 10 ** 18);
        setBalance(balance / 10 ** 18);
    };

    const sendTransaction = async () => {
        // Get the signer from the UniversalProvider

        let web3Provider = new ethers.providers.Web3Provider(provider);

        const signer = web3Provider.getSigner();
        const { chainId } = await web3Provider.getNetwork();
        const amount = ethers.utils.parseEther('0.00001');
        const transaction =
        {
            from: address,
            to: ToAddress,
            value: amount,
            chainId
        };
        // Send the transaction using the signer
        const txResponse = await signer.sendTransaction(transaction);

        const transactionHash = txResponse.hash;
        console.log('transactionHash is ' + transactionHash);
        // Wait for the transaction to be mined (optional)
        const receipt = await txResponse.wait();
        console.log('Transaction was mined in block:', receipt.blockNumber);

    };


    const newContract = () => {
        console.log('aaaa0', provider)
        let web3Provider = new ethers.providers.Web3Provider(provider);

        const contract = new Contract(
            '0xc8a94a3d3d2dabc3c1caffffdca6a7543c3e3e65',
            [
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_to",
                            "type": "address"
                        },
                        {
                            "name": "_value",
                            "type": "uint256"
                        }
                    ],
                    "name": "transfer",
                    "outputs": [
                        {
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "type": "function"
                }
            ],
            web3Provider
        )

        console.log('aaaa')

        // let web3Provider = new ethers.providers.Web3Provider(provider);
        // console.log('aaaa1')


        const signer = web3Provider.getSigner()
        console.log('aaaa2')


        const aa = contract.connect(signer)
        console.log('aaaa3')


        const txSend = aa.transfer('0x22746588A503434fC1173af62a6Aa82159EBeD25', ethers.utils.parseEther('0.001'))
        console.log('aaaa4')

    }


   const sendUsdtTransaction = async () => {
    try {
        let web3Provider = new ethers.providers.Web3Provider(provider);
        const usdtContract = new ethers.Contract(USDT_ADDRESS, usdtAbi, web3Provider.getSigner());
        const amount = ethers.utils.parseEther('0.00001');
    
        const tx = await usdtContract.transfer(ToAddress, amount, {gasLimit: 1000000});
        await tx.wait();
        Alert.alert('Send usdt success!');
    } catch(ex) {
        Alert.alert('Send Usdt failed')
    }
   };

    return (
        <>
            {/* {isConnected ? (
                <BlockchainActions onDisconnect={() => {
                    if (isConnected) {
                        return provider?.disconnect();
                    }
                }} />) : */}
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <TouchableOpacity
                    onPress={() => {
                        console.log("aaaaa");
                        open()
                            .then(() => {
                                console.log("Opennnnnnnn");
                            })
                            .catch((error) => {
                                console.log("errrorrrrrrrrrr");
                                console.log(error);
                            });
                    }}
                    style={styles.button}
                >
                    <Text>Connect</Text>
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Text> Address : {address}</Text>
                    <TouchableOpacity style={styles.buttonReload} onPress={() => getClientId()}>
                        <Text>Get Client ID</Text>
                    </TouchableOpacity>
                    <Text> Balance : {balance}</Text>
                    <TouchableOpacity style={styles.buttonReload} onPress={() => getMaticBalance()}>
                        <Text>Get Balance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonReload} onPress={() => sendTransaction()}>
                        <Text>send</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonReload} onPress={() => newContract()}>
                        <Text>send Custom</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonReload} onPress={() => sendUsdtTransaction()}>
                        <Text>send usdt</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonReload} onPress={() => {
                        if (isConnected) {
                            return provider?.disconnect();
                        }
                    }}>
                        <Text>disconnect</Text>
                    </TouchableOpacity>
                </View>
                <WalletConnectModal
                    projectId={projectId}
                    providerMetadata={providerMetadata}
                    sessionParams={sessionParams}
                />
            </View>
            {/* } */}
        </>
    );
};

export default ConnectMetamask;

const styles = StyleSheet.create({

    button: {
        backgroundColor: "#0074f9",
        padding: 15,
        marginBottom: 20,
        alignItems: "center",
        borderRadius: 20,
        marginHorizontal: 40
    },
    text: {
        color: "#333333",
    },
    buttonReload: {
        backgroundColor: "#de0261",
        padding: 10,
        marginBottom: 20,
        alignItems: "center",
        borderRadius: 20,
        width: 200,
        marginTop: 20
    },
});