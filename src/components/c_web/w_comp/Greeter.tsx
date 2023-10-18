import { useEffect, useState } from "react";

export const Greeter = () => {
    const [greeting, setGreeting] = useState<string>("");
    const [repeat, setRepeat] = useState<boolean>(true);
    const [cursor, setCursor] = useState<string>("|");
    const [index, setIndex] = useState<number>(0);

    function blink() {
        setCursor((prev: string) => prev === "|" ? "" : "|");
    };

    useEffect(() => {
        setTimeout(() => {
            write(getGreeting()[index], setGreeting).then((value) => {
                setIndex(val => val >= 4 ? 0 : val + 1);
                setTimeout(() => {
                    erase(value, setGreeting).then(() => {
                        setRepeat(val => !val);
                    });
                }, 1000)
            });
        }, 1000)
    }, [repeat]);

    useEffect(() => {
        const interval = setInterval(() => {
            blink();
        }, 700);
        return () => clearInterval(interval);
    }, []);


    return (
        <h1 style={{ fontSize: "3vmin" }}>{greeting}{cursor}</h1>
    )

    function getGreeting() {
        const userName: string = localStorage.getItem("name") || "";
    
        const date: Date = new Date();
        const hours: number = date.getHours();
        let greeting: Array<string> = [];
        if (hours < 12) {
            greeting = ["Good morning", "Buenos dias", "Bon dia", "Bonjour", "おはよう"];
        } else if (hours < 18) {
            greeting = ["Good afternoon", "Buenas tardes", "Bona tarda", "Bonsoir", "こんにちは"];
        } else {
            greeting = ["Good night", "Buenas noches", "Bona nit", "bonne nuit", "こんばんは"];
        }
        if (userName) {
            return greeting.map((greet: string) =>
                `${greet}${', ' + userName}!`
            );
        } else {
            return greeting.map((greet: string) =>
                `${greet}!`
            );
        }
    };
    
    async function write (text: string, setGreeting: Function): Promise<string> {
        return new Promise(resolve => {
            // funcion que recibe un texto y lo escribe letra por letra
            let index = 0;
            const interval = setInterval(() => {
                const char = text.charAt(index);
                if (index < text.length) {
                    setGreeting((prev: string) => prev + char);
                    index++;
                } else {
                    clearInterval(interval);
                    resolve(text);
                }
            }, 100);
        });
    };
    
    // funcion que borra el texto letra por letra
    async function erase (text: string, setGreeting: Function) {
        return new Promise(resolve => {
            let index = 0;
            const interval = setInterval(() => {
                if (index < text.length) {
                    setGreeting((prev: string) => prev.slice(0, -1));
                    index++;
                } else {
                    clearInterval(interval);
                    resolve(true);
                }
            }, 100);
        });
    };
}
