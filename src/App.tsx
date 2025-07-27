
import { Button, Textarea, Text, Box, Stack, Select, Flex } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons'
import { GoogleGenAI } from "@google/genai";
import { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);
  const [firstInputText, setFirstInputText] = useState("")
  const [summaryText, setSummaryText] = useState("")
  const [speaking, setSpeaking] = useState("")

  // The client gets the API key from the environment variable `GEMINI_API_KEY`.

  // フォーム1個目の記入内容を見る
  const changeFirstForm = (e) => {
    setFirstInputText(e.target.value);
  };

  const changeSelect = (e) => {
    setSpeaking(e.target.value);
  };

  // ボタンを押した時の処理
  const getSummeryText = () => {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
    const prompt = `
     ${firstInputText}
    上記の文章もしくは内容を140字以内で要約してください。
    文字数は表示しないでください。
    文章は${speaking}の口語で教えてください。
    `
    async function main() {
      setLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      setLoading(false);
      setSummaryText(response.text!);
    }
    main();

  };
  // クリアボタンを押した時の処理
  const onClickClear = () => {
    setFirstInputText("");
    setSummaryText("");
  };

  const setCopySummery = async () => {
    try {
      navigator.clipboard.writeText(summaryText);
    } catch {
      return;
    }
  };

  return (
    <>
      <Box background={'gray.100'} padding={5} w={'100vw'} minH={'100vh'}>
        <Box maxW={'800px'} margin={'0 auto'} >
          <Text as="h1" fontSize={'xl'} textAlign={'center'} mb={'20px'} fontWeight={'bold'}>📝テキスト要約ツール</Text>
          <Text fontSize={'sm'} mb={2} textAlign={'center'}>AIを使用して長いテキストを簡潔に要約します</Text>
          <Stack spacing={5}>
            <Box background={'white'} padding={5} borderRadius={10}>
              <Stack spacing={1}>
                <Text fontSize={'sm'}>テキスト</Text>
                <Textarea onChange={changeFirstForm} placeholder='ここに要約したいテキストを入力してください ' value={firstInputText} />
                <Text fontSize={'sm'}>
                </Text>
                <Select onChange={changeSelect} placeholder='話し方を選択'>
                  <option value='標準語'>標準語</option>
                  <option value='関西弁'>関西弁</option>
                  <option value='絵文字を使ったギャル語'>ギャル語</option>
                  <option value='博多弁'>博多弁</option>
                </Select>
                <Flex gap={2}>
                  <Button onClick={getSummeryText} flex="1">
                    要約する
                  </Button>
                  <Button background={'white'} onClick={() => onClickClear()} width="80px" borderWidth="1px" borderColor="gray.300">
                    クリア
                  </Button>
                </Flex>
              </Stack>
            </Box>
            <Box background={'white'} padding={5} borderRadius={10}>
              <Text fontSize={'sm'}>要約結果</Text>
              <Box border={'1px solid'} borderColor="gray.300" padding={5} borderRadius={10} mb={2}>
                {loading ? (
                  <Text textAlign={'center'} mt={2}>ローディング中...</Text>
                ) : (<Text>{summaryText}</Text>)}
              </Box>
              <Button w={'100%'} onClick={setCopySummery}>要約をコピー　<CopyIcon color={'gray'} boxSize={5} />
              </Button>
            </Box>
            <Box background={'white'} padding={5} borderRadius={10}>
              <Text fontSize={'sm'} mb={2}>使用方法</Text>
              <Text fontSize={'xs'} mb={1}>1. 要約したいテキストを入力してください</Text>
              <Text fontSize={'xs'} mb={1}>2. 話し方を選択してください</Text>
              <Text fontSize={'xs'} mb={1}>3. 「要約する」ボタンを押してください</Text>
            </Box>
          </Stack>
        </Box >
      </Box >
    </>
  )
}

export default App;
