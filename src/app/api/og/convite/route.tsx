import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

let outfitData: ArrayBuffer | null = null;
let interData: ArrayBuffer | null = null;
let logoData: string | null = null;

async function getAssets() {
  if (!outfitData) {
    try {
      const outfitBuffer = await readFile(
        join(process.cwd(), 'src/commons/assets/fonts/Outfit-Bold.ttf')
      );
      outfitData = outfitBuffer.buffer.slice(
        outfitBuffer.byteOffset,
        outfitBuffer.byteOffset + outfitBuffer.byteLength
      );
    } catch (e) {
      console.error('Erro ao carregar fonte Outfit-Bold:', e);
    }
  }

  if (!interData) {
    try {
      const interBuffer = await readFile(
        join(process.cwd(), 'src/commons/assets/fonts/Inter-Medium.ttf')
      );
      interData = interBuffer.buffer.slice(
        interBuffer.byteOffset,
        interBuffer.byteOffset + interBuffer.byteLength
      );
    } catch (e) {
      console.error('Erro ao carregar fonte Inter-Medium:', e);
    }
  }

  if (!logoData) {
    try {
      const logoBuffer = await readFile(join(process.cwd(), 'public/logo.png'));
      const base64 = logoBuffer.toString('base64');
      logoData = `data:image/png;base64,${base64}`;
    } catch (e) {
      console.error('Erro ao carregar o logo:', e);
    }
  }

  return { outfitData, interData, logoData };
}

export async function GET(req: Request) {
  try {
    const { outfitData: outfit, interData: inter, logoData: logo } = await getAssets();
    const { searchParams } = new URL(req.url);
    const daysParam = searchParams.get('days') || '';
    const days = daysParam.split(',').filter(Boolean);

    const fonts = [];
    if (outfit) {
      fonts.push({ name: 'Outfit', data: outfit, style: 'normal' as const, weight: 700 as const });
    }
    if (inter) {
      fonts.push({ name: 'Inter', data: inter, style: 'normal' as const, weight: 500 as const });
    }

    return new ImageResponse(
      (
        <div
          tw="flex flex-col w-full h-full items-center justify-between py-24 px-12 relative"
          style={{
            background: 'linear-gradient(180deg, #f5f3ff 0%, #f3e8ff 50%, #ede9fe 100%)',
          }}
        >
          {/* Marca d'água de fundo - Sutil */}
          {logo && (
            <div tw="absolute flex" style={{ top: '35%', left: '15%', opacity: 0.07 }}>
              <img src={logo} width={700} height={863} />
            </div>
          )}

          {/* Header */}
          <div tw="flex flex-col items-center text-center">
            {logo && (
              <div
                tw="flex bg-white rounded-full shadow-xl mb-10 border-2 border-purple-100"
                style={{ width: '220px', height: '220px', justifyContent: 'center', alignItems: 'center' }}
              >
                <img src={logo} width={140} height={177} style={{ objectFit: 'contain' }} />
              </div>
            )}

            <h1
              style={{
                fontFamily: 'Outfit',
                fontSize: '90px',
                lineHeight: '1',
                color: '#4c1d95',
                fontWeight: 'bold',
                marginBottom: '20px',
              }}
            >
              Dias Disponíveis
            </h1>


            <p
              style={{
                fontFamily: 'Inter',
                fontSize: '40px',
                color: '#7c3aed',
                fontWeight: '500',
                opacity: 0.8
              }}
            >
              Poderosa, reserve seu momento de brilho! ✨
            </p>
          </div>

          {/* Grid de Horários - Centralizado */}
          <div tw="flex flex-1 flex-col justify-center items-center w-full py-10">
            <div tw="flex flex-wrap justify-center items-center w-full">
              {days.map((day, index) => {
                const [label, num] = day.split(' ');
                return (
                  <div
                    key={index}
                    tw="flex flex-col items-center justify-center bg-white/95 m-3 p-5 rounded-[45px] border border-purple-50 shadow-xl"
                    style={{ width: '250px', height: '250px' }}
                  >
                    <span
                      style={{
                        fontFamily: 'Inter',
                        fontSize: '28px',
                        color: '#7c3aed',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        letterSpacing: '2px',
                        marginBottom: '4px'
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Outfit',
                        fontSize: '95px',
                        color: '#4c1d95',
                        fontWeight: 'bold',
                        lineHeight: '1'
                      }}
                    >
                      {num}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rodapé Minimalista */}
          <div tw="flex flex-col items-center">
            <div tw="flex items-center opacity-40">
              <span style={{ color: '#4c1d95', fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px' }}>
                LULUZINHA • SEU ESPAÇO DIGITAL
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1920,
        fonts,
        headers: {
          'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
