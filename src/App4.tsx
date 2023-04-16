import React, { useCallback, useEffect, useRef, useState } from 'react';
import alpha from './alpha.png';
import './App.css';
import { Box, Button, Container, Grid, Paper, Slider, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import styled from '@emotion/styled';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';

const Scene = styled.div`
  width: 128px;
  height: 128px;
  background-image: url(${alpha});
  background-repeat: repeat;
  background-size: 16px;
  margin: 0 auto;
`;

const Canvas = styled.canvas`
  display: block;
  width: 128px;
  height: 128px;
`;

const Result = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 128px;
  height: 128px;

  box-shadow: 0 0 3px rgba(0,0,0,.3);
  background-image: url(${alpha});
  background-repeat: repeat;
  background-size: 16px;
`;

const Image = styled.img`
  width: 128px;
  height: 128px;
  image-rendering: pixelated;  
`;

const Size = styled(Typography)`
  color: gray;
` as typeof Typography;

const HiddenCanvas = styled.canvas`
  display: none;
`;

function valueLabelFormat(value: number) {
  return `${value}px`;
}

const marks = [
  { value: Math.pow(2, 1) },
  { value: Math.pow(2, 2) },
  { value: Math.pow(2, 3) },
  { value: Math.pow(2, 4) },
  { value: Math.pow(2, 5) },
  { value: Math.pow(2, 6) },
  { value: Math.pow(2, 7) },
  { value: Math.pow(2, 8) },
  { value: Math.pow(2, 9) },
];

function App4() {

  const [size, setSize] = useState(128);
  const [mode, setMode] = useState("add");
  const [weight, setWeight] = useState(50);

  const [dataURL, setDataURL] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;

    // retina対策
    canvas.width = size;
    canvas.height = size;
    context.imageSmoothingEnabled = true;

    let radgradient = context.createRadialGradient(canvas.width / 2.0, canvas.height / 2.0, 0, canvas.width / 2.0, canvas.height / 2.0, size * weight / 2 / 100);
    radgradient.addColorStop(0, '#ffffffff');
    radgradient.addColorStop(1, '#ffffff00');

    context.beginPath();

    if (mode === "add") {
      context.fillStyle = 'black';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.arc(canvas.width / 2.0, canvas.height / 2.0, size * weight / 2 / 100, 0, Math.PI * 2.0, true);
    context.fillStyle = radgradient;
    context.fill();

    setDataURL(canvas.toDataURL("image/png"));
  }, [mode, size, weight]);

  const onChangeSize = useCallback((e: any, val: any) => {
    setSize(val);
  }, []);

  const onChangeWeight = useCallback((e: any, val: any) => {
    setWeight(val);
  }, []);

  const onChangeMode = useCallback((e: any, val: any) => {
    setMode(val);
  }, []);

  return (
    <div className="App">
      <Container maxWidth="sm">

        <Grid py={2} container spacing={2} justifyContent="center">

          <Grid item xs={8}>
            <Typography variant="caption">プレビュー</Typography>
            <Paper>
              <Box p={2}>
                <Scene>
                  <Canvas ref={canvasRef} />
                </Scene>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={8}>
            <Typography variant="caption">操作</Typography>
            <Paper>
              <Box px={2} py={1}>

                <Stack spacing={2} direction="row" alignItems="center">

                  <Typography variant='caption' noWrap sx={{ width: "4em" }}>
                    タイプ
                  </Typography>

                  <ToggleButtonGroup
                    color="primary"
                    value={mode}
                    exclusive
                    onChange={onChangeMode}
                    size="small"
                  >
                    <ToggleButton value="alpha">アルファブレンド</ToggleButton>
                    <ToggleButton value="add">加算</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                <Stack spacing={2} direction="row" alignItems="center">

                  <Typography variant='caption' noWrap sx={{ width: "4em" }}>
                    サイズ
                  </Typography>

                  <Slider
                    size="small"
                    valueLabelDisplay="auto"
                    value={size}
                    min={32}
                    max={512}
                    step={null}
                    marks={marks}
                    valueLabelFormat={valueLabelFormat}
                    onChange={onChangeSize}
                  />
                </Stack>

                <Stack spacing={2} direction="row" alignItems="center">

                  <Typography variant='caption' noWrap sx={{ width: "4em" }}>
                    割合
                  </Typography>

                  <Slider
                    size="small"
                    valueLabelDisplay="auto"
                    value={weight}
                    min={0}
                    max={100}
                    step={1}
                    onChange={onChangeWeight}
                  />
                </Stack>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={8}>
            <Typography variant="caption">結果</Typography>
            <Paper>
              <Box p={2}>
                <Stack spacing={2} alignItems="center">

                  <Box>
                    <Result>
                      <HiddenCanvas ref={canvasRef2} />
                      <Image src={dataURL} alt='result' />
                    </Result>

                    <Size variant='caption' align='center' component='p'>
                      {`${size}x${size} (${weight})`}
                    </Size>
                  </Box>

                  <Button variant="outlined" startIcon={<DownloadForOfflineIcon />} href={dataURL} download={`particle-${size}x${size} (${weight}).png`}>
                    ダウンロード
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>

        </Grid>

      </Container>
    </div>
  );
}

export default App4;
