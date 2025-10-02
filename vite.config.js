import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // 사용하는 플러그인

export default defineConfig(({ command, mode }) => {
  // 'command'는 'serve'(개발) 또는 'build'(빌드)가 됩니다.
  // 'mode'는 실행 모드입니다. (보통 'development' 또는 'production')

  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    // ★★★ 여기가 핵심 ★★★
    // 프로덕션 빌드일 때만 '/service1/'을 base로 설정하고,
    // 로컬 개발 서버일 때는 기본값인 '/'를 사용합니다.
    base: isProduction ? '/service1/' : '/',
  };
});