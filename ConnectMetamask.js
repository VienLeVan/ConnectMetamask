import {
    ActivityIndicator,
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
import { ethers } from 'ethers';


const projectId = "801b302fd99f8b54bc7db7fa08c2d3c3";

const ConnectMetamask = () => {
    const [isShow, setIsShow] = useState(false);
    const { close, open, isConnected, provider, address } = useWalletConnectModal();
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

        // try {
        //     const response = await axios.post(
        //         "https://bsc-dataseed.binance.org",
        //         // "https://convincing-divine-diagram.matic.discover.quiknode.pro/f46a1ffad55010d5f1612797989552405f3601e5/",
        //         {
        //             jsonrpc: "2.0",
        //             id: 1,
        //             method: "eth_getBalance",
        //             params: [address, "latest"],
        //         }
        //     );
        //     const balance = parseInt(response.data.result, 16);
        //     console.log(response.data);
        //     console.log("Matic Balance:", balance / 10 ** 18);
        //     setBalance(balance / 10 ** 18);
        // } catch (error) {
        //     console.error("Error retrieving Matic balance:", error);
        // }
    };

    const sendTransaction = async () => {
        // Get the signer from the UniversalProvider

        // let web3Provider = new ethers.providers.Web3Provider(provider);

        const signer = web3Provider.getSigner();
        const { chainId } = await web3Provider.getNetwork();
        const amount = ethers.utils.parseEther('0.0001');
        const ToAddress = '0x22746588A503434fC1173af62a6Aa82159EBeD25';
        const transaction =
        {
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