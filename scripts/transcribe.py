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

        # base 模型：比 small 快 3-4 倍，普通话识别率差距极小
        # int8 量化进一步提速；local_files_only 跳过 HuggingFace 网络验证
        model = WhisperModel('base', device='cpu', compute_type='int8', local_files_only=True, revision='ebe41f70d5b6dfa9166e2c581c45c9c0cfc57b66')

        # 传入热词列表，引导 Whisper 优先匹配这些词（提升品牌名/产品名识别率）
        # 对"小信"这类易被识别成"小心"的词尤其有效
        extra = ['小信', '联信装机', 'aixiwu', '爱希物']
        segments, info = model.transcribe(
            wav_path,
            language='zh',
            vad_filter=False,
            initial_prompt='。'.join(extra),   # 句间加点防止粘连
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
