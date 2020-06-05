
import React, { useState, useEffect } from 'react';

import { Input, Button } from 'semantic-ui-react'
import { loremIpsum } from "lorem-ipsum";

const TypeRacer = () => {

    const [writtenWord, setWrittenWord] = useState('');
    const [writtenWords, setWrittenWords] = useState([]);
    const [leftWrittenWords, setLeftWrittenWords] = useState([]);
    const [currentWord, setCurrentWord] = useState('');
    const [correctLetters, setCorrectLetters] = useState('');
    const [isFinished, setFinished] = useState(true);
    const [showNewGameOption, setShowNewGameOption] = useState(true);
    const [correctLettersCount, setCorrectLettersCount] = useState(0);
    const [timePassed, setTimepassed] = useState(0);
    const [hasStartedTyping, setHasStartedTyping] = useState(false);

    useEffect(() => {
        let newSentence = loremIpsum();
        let splittedWord = newSentence.split(' ');
        setLeftWrittenWords(splittedWord.slice(1));
        setWrittenWords([]);
        setCurrentWord(splittedWord[0]);
    }, []);

    useEffect(() => {
        if (currentWord == '' && hasStartedTyping == true) {
            setShowNewGameOption(true);
            setFinished(true);
        }
        if (currentWord == '') {
            setHasStartedTyping(false);
        }
    }, [currentWord]);

    useEffect(() => {
        if (hasStartedTyping) {
            const interval = setInterval(() => {
                setTimepassed(timePassed => timePassed + 1);
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [hasStartedTyping]);

    const handleChangeWord = (word) => {
        setHasStartedTyping(true);

        if (currentWord == word)
            handleCorrectWord()
        else
            handleUncorrectWord(word);
    }

    const handleCorrectWord = () => {
        setCorrectLettersCount(correctLettersCount + 1);
        setWrittenWords(writtenWords.concat(currentWord));
        setCurrentWord(leftWrittenWords.length == 0 ? '' : leftWrittenWords[0]);
        setLeftWrittenWords(leftWrittenWords.slice(1));
        setWrittenWord('');
        setCorrectLetters('');
    }

    const handleUncorrectWord = (word) => {
        let commonLetters = getCommonLetters(word, currentWord);
        setCorrectLettersCount(commonLetters.length > correctLetters.length ? correctLettersCount + 1 : correctLettersCount);
        setCorrectLetters(word.slice(0, commonLetters.length));
        setWrittenWord(word);
    }

    const getCommonLetters = (word1, word2) => {
        for (var i = 0; i < Math.min(word1.length, word2.length); i++) {
            if (word1[i] != word2[i])
                break;
        }

        return word1.slice(0, i);
    }

    const startNewRaceHandler = () => {
        setShowNewGameOption(false);
        setFinished(false);
        setCorrectLettersCount(0);
        setTimepassed(0);
    }

    const getWordsPerMinuteCount = () => {
        return timePassed == 0 ? 0 : Math.floor((correctLettersCount / timePassed) * 60);
    }

    return (
        <div style={{ textAlign: 'center', fontFamily: '"Times New Roman", Times, serif', marginTop: '5vh' }}>
            {isFinished &&
                <div style={{ marginBottom: '1%' }}>
                    Results: {getWordsPerMinuteCount()} WPM
                </div>
            }

            {
                showNewGameOption && <Button onClick={startNewRaceHandler}>Start a new race</Button>
            }

            {
                !isFinished && // writtenWords + currentWords + leftWords
                <div>
                    <p style={{ fontSize: '22px' }}>
                        <span style={{ color: 'green' }}>{writtenWords.join(' ')}</span>
                        <span> <span style={{ textDecorationLine: 'underline' }}><span style={{ color: 'green' }}>{correctLetters}</span><span>{currentWord.slice(correctLetters.length)}</span></span></span>
                        <span> </span>
                        <span>{leftWrittenWords.join(' ')}</span>
                    </p>
                    <div style={{ textAlign: 'center' }}>
                        <Input value={writtenWord} onChange={(event) => handleChangeWord(event.target.value)} style={{ width: '50%' }} />
                    </div>
                    <div style={{ marginTop: '1%' }}>
                        {getWordsPerMinuteCount()} WPM
                    </div>
                </div>
            }
        </div>
    )
}

export default TypeRacer;