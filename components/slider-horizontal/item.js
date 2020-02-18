import React, {useState, useEffect, useInterval} from 'react';
import { StyleSheet, Text, View, Image, FlatList, Dimensions, TouchableWithoutFeedback, Animated } from 'react-native';
import SkeletonContent from "react-native-skeleton-content";
const IMG_URL = "https://image.tmdb.org/t/p/w500"


export default function Item(props) { 
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        console.log(props.item)
        if (props.item.item.poster_path) {
            const timer = setTimeout(() => {setIsLoading(false)}, 4500);
            return () => clearTimeout(timer)
        }
    }, [])

    return (
        <View>
            <SkeletonContent
                containerStyle={{flex: 1, alignContent: 'center'}}
                boneColor="#121212"
                highlightColor="#2d2d2d"
                animationType="pulse"
                duration={1400}
                delay={200}
                isLoading={isLoading}
                layout={[
                { width: 150, height: 240, marginVertical: 10, borderRadius: 5},
                ]}
                >       
                {props.item.item.poster_path && 
                    <TouchableWithoutFeedback onPress={() => props.navigation.push('ShowItem', {item: props.item.item})}>
                        <Image
                        style={{width: 150, height: 240, borderRadius: 5, marginVertical: 10}}
                        source={{uri: `${IMG_URL}${props.item.item.poster_path}`}}
                        />
                    </TouchableWithoutFeedback>
                }
            </SkeletonContent>
        </View>
    )
}

