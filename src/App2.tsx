import React, { useCallback, useEffect, useRef, useState } from 'react';
import skybox from './skybox.png';
import './App.css';
import { Box, Button, Container, Grid, Paper, Slider, Stack, Typography } from '@mui/material';
import styled from '@emotion/styled';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import alpha from './alpha.png';

const Scene = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background-image: url(${skybox});
  background-size: contain;
  margin: 0 auto;
`;

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
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

function App2() {

  const [size, setSize] = useState(128);
  const [dataURL, setDataURL] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;

    // retina対策
    canvas.width = 320 * 2;
    canvas.height = 180 * 2;

    context.imageSmoothingEnabled = true;
    context.beginPath();

    const fixedSize = size * canvas.height / 1080;
    context.arc(canvas.width / 2.0, canvas.height / 2.0, fixedSize / 2.0, 0, Math.PI * 2.0, true);
    context.fillStyle = "white";
    context.fill();

    const canvas2 = canvasRef2.current!;
    const context2 = canvas2.getContext("2d")!;

    canvas2.width = size;
    canvas2.height = size;

    context2.imageSmoothingEnabled = true;
    context2.beginPath();

    context2.arc(size / 2.0, size / 2.0, size / 2.0, 0, Math.PI * 2.0, true);
    context2.fillStyle = "white";
    context2.fill();

    setDataURL(canvas2.toDataURL("image/png"));
  }, [size]);

  const onChangeSize = useCallback((e: any, val: any) => {
    setSize(val);
  }, []);

  return (
    <div className="App">
      <Container maxWidth="sm">

        <Grid py={2} container spacing={2} justifyContent="center">

          <Grid item xs={8}>
            <Typography variant="caption">プレビュー</Typography>
            <Paper>
              <Box p={2}>
                <Scene><Canvas ref={canvasRef} /></Scene>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={8}>
            <Typography variant="caption">操作</Typography>
            <Paper>
              <Box px={2} py={1}>

                <Stack spacing={2} direction="row" alignItems="center">

                  <Typography variant='caption' noWrap sx={{ width: "4em" }}>
                    直径
                  </Typography>

                  <Slider
                    size="small"
                    aria-label="Small"
                    valueLabelDisplay="auto"
                    value={size}
                    min={2}
                    max={512}
                    step={2}
                    valueLabelFormat={valueLabelFormat}
                    onChange={onChangeSize}
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
                      {`${size}x${size}`}
                    </Size>
                  </Box>

                  <Button variant="outlined" startIcon={<DownloadForOfflineIcon />} href={dataURL} download={`circle-${size}x${size}.png`}>
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

export default App2;
