#!/usr/bin/env python3
"""
语音转文字：Silero VAD 断句 + faster-whisper 推理
用法：python3 transcribe.py <audio_file>
输入：webm/opus 或 wav/pcm
输出：JSON { text: "..." }
"""
import sys
import json
import tempfile
import subprocess
import os

def convert_to_wav(input_path):
    """用 ffmpeg 把任意音频转成 16kHz 单声道 wav"""
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
        tmp_path = tmp.name
    cmd = [
        'ffmpeg', '-y',
        '-i', input_path,
        '-ar', '16000',
        '-ac', '1',
        '-c:a', 'pcm_s16le',
        tmp_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return tmp_path

def transcribe(audio_path):
    try:
        from faster_whisper import WhisperModel

        # 转wav（确保 16kHz 单声道）
        wav_path = convert_to_wav(audio_path)

        # 小模型足够 CPU 实时：tiny/base 均可
        # 首次运行自动下载模型到 ~/.cache/huggingface/
        model = WhisperModel('base', device='cpu', compute_type='int8', local_files_only=True)

        # 实际推理
        segments, info = model.transcribe(
            wav_path,
            language='zh',
            vad_filter=True,       # 启用 Silero VAD 智能断句
            vad_parameters=dict(min_silence_duration_ms=500),
        )

        full = []
        for seg in segments:
            txt = seg.text.strip()
            if txt:
                full.append(txt)

        text = ' '.join(full)
        return text.strip()

    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'Usage: transcribe.py <audio_file>'}), file=sys.stderr)
        sys.exit(1)

    audio_file = sys.argv[1]
    if not os.path.exists(audio_file):
        print(json.dumps({'error': f'File not found: {audio_file}'}), file=sys.stderr)
        sys.exit(1)

    result = transcribe(audio_file)
    print(json.dumps({'text': result, 'lang': 'zh'}))
