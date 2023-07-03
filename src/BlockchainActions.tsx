import React from 'react';
import {useWalletConnectModal} from '@walletconnect/modal-react-native';
import {ethers} from 'ethers';
import {useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';

interface Props {
    onDisconnect: () => void;
}

export const BlockchainActions = ({onDisconnect}: Props) => {
    const {provider} = useWalletConnectModal();

    const web3Provider = useMemo(
        () => (provider ? new ethers.providers.Web3Provider(provider) : undefined),
        [provider],
    );
}