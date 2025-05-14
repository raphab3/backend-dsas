import {
  ExamType,
  ExamCategoryEnum,
} from '@modules/patientHealth/nestedsModules/exams/entities/exam-type.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface ICreateExamType {
  name: string;
  category: ExamCategoryEnum;
  description?: string;
}

@Injectable()
export class ExamTypeSeedService {
  constructor(
    @InjectRepository(ExamType)
    private readonly examTypeRepository: Repository<ExamType>,
  ) {}

  async execute(): Promise<void> {
    const examTypes: ICreateExamType[] = [
      // LABORATORY - Exames laboratoriais
      {
        name: 'HEMOGRAMA COMPLETO',
        category: ExamCategoryEnum.LABORATORY,
        description:
          'Avaliação das células sanguíneas (hemácias, leucócitos e plaquetas)',
      },
      {
        name: 'GLICEMIA DE JEJUM',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Medição dos níveis de glicose no sangue após jejum',
      },
      {
        name: 'COLESTEROL TOTAL E FRAÇÕES',
        category: ExamCategoryEnum.LABORATORY,
        description:
          'Avaliação dos níveis de colesterol total, HDL, LDL e VLDL',
      },
      {
        name: 'TRIGLICERÍDEOS',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Medição dos níveis de triglicerídeos no sangue',
      },
      {
        name: 'UREIA',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Avaliação da função renal',
      },
      {
        name: 'CREATININA',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Avaliação da função renal',
      },
      {
        name: 'ÁCIDO ÚRICO',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Medição dos níveis de ácido úrico no sangue',
      },
      {
        name: 'TGO/AST',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Avaliação da função hepática',
      },
      {
        name: 'TGP/ALT',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Avaliação da função hepática',
      },
      {
        name: 'GAMA GT',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Avaliação da função hepática e biliar',
      },
      {
        name: 'FOSFATASE ALCALINA',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Avaliação da função hepática e óssea',
      },
      {
        name: 'BILIRRUBINAS TOTAIS E FRAÇÕES',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Avaliação da função hepática',
      },
      {
        name: 'TSH',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Avaliação da função da tireoide',
      },
      {
        name: 'T4 LIVRE',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Avaliação da função da tireoide',
      },
      {
        name: 'HEMOGLOBINA GLICADA (HBA1C)',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Avaliação do controle glicêmico nos últimos 3 meses',
      },
      {
        name: 'URINA TIPO I (EAS)',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Análise de elementos e sedimentos anormais na urina',
      },
      {
        name: 'PARASITOLÓGICO DE FEZES',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Identificação de parasitas intestinais',
      },
      {
        name: 'PROTEÍNA C REATIVA (PCR)',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Marcador de inflamação',
      },
      {
        name: 'VHS',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Velocidade de hemossedimentação, marcador de inflamação',
      },
      {
        name: 'FERRITINA',
        category: ExamCategoryEnum.LABORATORY,
        description: 'Avaliação das reservas de ferro no organismo',
      },

      // IMAGING - Exames de imagem
      {
        name: 'RAIO-X DE TÓRAX',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação dos pulmões, coração e estruturas torácicas',
      },
      {
        name: 'RAIO-X DE COLUNA LOMBAR',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação da coluna lombar',
      },
      {
        name: 'RAIO-X DE COLUNA CERVICAL',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação da coluna cervical',
      },
      {
        name: 'RAIO-X DE JOELHO',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação da articulação do joelho',
      },
      {
        name: 'RAIO-X DE OMBRO',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação da articulação do ombro',
      },
      {
        name: 'ULTRASSONOGRAFIA ABDOMINAL TOTAL',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação dos órgãos abdominais',
      },
      {
        name: 'ULTRASSONOGRAFIA DE TIREOIDE',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação da glândula tireoide',
      },
      {
        name: 'ULTRASSONOGRAFIA PÉLVICA',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação dos órgãos pélvicos',
      },
      {
        name: 'ULTRASSONOGRAFIA TRANSVAGINAL',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação dos órgãos pélvicos femininos',
      },
      {
        name: 'ULTRASSONOGRAFIA DE PRÓSTATA',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação da próstata',
      },
      {
        name: 'ULTRASSONOGRAFIA DE MAMAS',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação das mamas',
      },
      {
        name: 'MAMOGRAFIA',
        category: ExamCategoryEnum.IMAGING,
        description: 'Rastreamento de câncer de mama',
      },
      {
        name: 'TOMOGRAFIA COMPUTADORIZADA DE CRÂNIO',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação detalhada do crânio e cérebro',
      },
      {
        name: 'TOMOGRAFIA COMPUTADORIZADA DE TÓRAX',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação detalhada do tórax',
      },
      {
        name: 'TOMOGRAFIA COMPUTADORIZADA DE ABDOME',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação detalhada do abdome',
      },
      {
        name: 'RESSONÂNCIA MAGNÉTICA DE CRÂNIO',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação detalhada do crânio e cérebro',
      },
      {
        name: 'RESSONÂNCIA MAGNÉTICA DE COLUNA LOMBAR',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação detalhada da coluna lombar',
      },
      {
        name: 'RESSONÂNCIA MAGNÉTICA DE JOELHO',
        category: ExamCategoryEnum.IMAGING,
        description: 'Avaliação detalhada da articulação do joelho',
      },

      // CARDIOLOGY - Exames cardiológicos
      {
        name: 'ELETROCARDIOGRAMA (ECG)',
        category: ExamCategoryEnum.CARDIOLOGY,
        description: 'Avaliação da atividade elétrica do coração',
      },
      {
        name: 'ECOCARDIOGRAMA',
        category: ExamCategoryEnum.CARDIOLOGY,
        description: 'Avaliação da estrutura e função do coração',
      },
      {
        name: 'TESTE ERGOMÉTRICO',
        category: ExamCategoryEnum.CARDIOLOGY,
        description: 'Avaliação da resposta cardíaca ao esforço físico',
      },
      {
        name: 'HOLTER 24 HORAS',
        category: ExamCategoryEnum.CARDIOLOGY,
        description:
          'Monitoramento contínuo da atividade cardíaca por 24 horas',
      },
      {
        name: 'MAPA (MONITORIZAÇÃO AMBULATORIAL DA PRESSÃO ARTERIAL)',
        category: ExamCategoryEnum.CARDIOLOGY,
        description: 'Monitoramento da pressão arterial por 24 horas',
      },
      {
        name: 'DOPPLER DE CARÓTIDAS',
        category: ExamCategoryEnum.CARDIOLOGY,
        description: 'Avaliação do fluxo sanguíneo nas artérias carótidas',
      },
      {
        name: 'DOPPLER VENOSO DE MEMBROS INFERIORES',
        category: ExamCategoryEnum.CARDIOLOGY,
        description: 'Avaliação do fluxo sanguíneo nas veias das pernas',
      },
      {
        name: 'DOPPLER ARTERIAL DE MEMBROS INFERIORES',
        category: ExamCategoryEnum.CARDIOLOGY,
        description: 'Avaliação do fluxo sanguíneo nas artérias das pernas',
      },

      // NEUROLOGY - Exames neurológicos
      {
        name: 'ELETROENCEFALOGRAMA (EEG)',
        category: ExamCategoryEnum.NEUROLOGY,
        description: 'Avaliação da atividade elétrica cerebral',
      },
      {
        name: 'ELETROMIOGRAFIA (EMG)',
        category: ExamCategoryEnum.NEUROLOGY,
        description: 'Avaliação da atividade elétrica dos músculos',
      },
      {
        name: 'POTENCIAL EVOCADO',
        category: ExamCategoryEnum.NEUROLOGY,
        description: 'Avaliação da condução nervosa',
      },
      {
        name: 'POLISSONOGRAFIA',
        category: ExamCategoryEnum.NEUROLOGY,
        description: 'Estudo do sono',
      },

      // OTHER - Outros exames
      {
        name: 'ENDOSCOPIA DIGESTIVA ALTA',
        category: ExamCategoryEnum.OTHER,
        description: 'Avaliação do esôfago, estômago e duodeno',
      },
      {
        name: 'COLONOSCOPIA',
        category: ExamCategoryEnum.OTHER,
        description: 'Avaliação do intestino grosso',
      },
      {
        name: 'DENSITOMETRIA ÓSSEA',
        category: ExamCategoryEnum.OTHER,
        description: 'Avaliação da densidade mineral óssea',
      },
      {
        name: 'ESPIROMETRIA',
        category: ExamCategoryEnum.OTHER,
        description: 'Avaliação da função pulmonar',
      },
      {
        name: 'AUDIOMETRIA',
        category: ExamCategoryEnum.OTHER,
        description: 'Avaliação da audição',
      },
      {
        name: 'TESTE ALÉRGICO',
        category: ExamCategoryEnum.OTHER,
        description: 'Identificação de alergias',
      },
      {
        name: 'BIÓPSIA',
        category: ExamCategoryEnum.OTHER,
        description: 'Coleta de amostra de tecido para análise',
      },
    ];

    for (const examTypeData of examTypes) {
      try {
        // Verificar se o tipo de exame já existe
        const existingExamType = await this.examTypeRepository.findOne({
          where: { name: examTypeData.name },
        });

        if (!existingExamType) {
          const examType = this.examTypeRepository.create(examTypeData);
          await this.examTypeRepository.save(examType);
          console.log(`Tipo de exame criado: ${examTypeData.name}`);
        } else {
          console.log(`Tipo de exame já existe: ${examTypeData.name}`);
        }
      } catch (error) {
        console.error(
          `Erro ao inserir tipo de exame ${examTypeData.name}:`,
          error,
        );
      }
    }

    console.log('Dados de Tipos de Exames inseridos com sucesso');
  }
}
