import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db, addDoc, collection, OperationType, handleFirestoreError } from '../firebase';
import { toast } from 'sonner';
import { Ruler, Send, CheckCircle2, Info } from 'lucide-react';
import { useState } from 'react';

const orderSchema = z.object({
  customerName: z.string().min(2, '이름을 입력해주세요.'),
  customerEmail: z.string().email('올바른 이메일 주소를 입력해주세요.'),
  petName: z.string().min(1, '반려동물의 이름을 입력해주세요.'),
  dimensions: z.string().min(10, '치수 정보를 상세히 입력해주세요 (목둘레, 가슴둘레, 등길이 등).'),
  request: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function CustomOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    try {
      // Submit to Formspree
      const formspreeResponse = await fetch('https://formspree.io/f/mlgobrjz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!formspreeResponse.ok) {
        throw new Error('Formspree submission failed');
      }

      // Also save to Firestore as backup/admin record
      await addDoc(collection(db, 'orders'), {
        ...data,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      });
      
      setIsSuccess(true);
      toast.success('맞춤 제작 문의가 성공적으로 접수되었습니다.');
      reset();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8 p-12 bg-white rounded-3xl shadow-2xl shadow-pastel-purple/10 border border-pastel-purple/20"
        >
          <div className="inline-flex p-4 bg-green-50 rounded-full text-green-500">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-serif font-bold text-ink">Thank You!</h2>
            <p className="text-ink/60 font-light leading-relaxed">
              맞춤 제작 문의가 성공적으로 접수되었습니다.<br />
              담당 디자이너가 확인 후 입력하신 이메일로 연락드리겠습니다.
            </p>
          </div>
          <button 
            onClick={() => setIsSuccess(false)}
            className="w-full py-4 rounded-full bg-pastel-purple text-white font-bold hover:bg-pastel-purple/90 transition-all"
          >
            새로운 문의하기
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <section className="bg-pastel-purple-light/20 py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-bold uppercase tracking-widest text-pastel-purple"
          >
            Custom Couture
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-ink"
          >
            Custom Order Process
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-ink/60 font-light max-w-2xl mx-auto leading-relaxed"
          >
            세상에 단 하나뿐인, 당신의 소중한 친구를 위한 특별한 드레스를 만듭니다.
          </motion.p>
        </div>
      </section>

      {/* Process & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Process Info */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold text-ink">맞춤 제작 프로세스</h2>
              <p className="text-ink/60 leading-relaxed font-light">
                폼폼윙클의 모든 맞춤 드레스는 아래와 같은 정교한 과정을 거쳐 완성됩니다.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { step: '01', title: '상담 신청', desc: '아래 폼을 통해 반려동물의 정보와 요청사항을 남겨주세요.' },
                { step: '02', title: '디자인 상담', desc: '디자이너가 직접 연락하여 원단, 디자인, 디테일을 상담합니다.' },
                { step: '03', title: '정밀 측정', desc: '반려동물의 체형을 완벽하게 반영하기 위한 추가 측정을 진행합니다.' },
                { step: '04', title: '제작 및 배송', desc: '약 2~3주의 제작 기간 후, 정성스럽게 포장하여 배송해 드립니다.' },
              ].map((item, i) => (
                <div key={i} className="flex space-x-6">
                  <span className="text-4xl font-serif font-bold text-pastel-purple/20">{item.step}</span>
                  <div className="space-y-1">
                    <h3 className="text-xl font-serif font-bold text-ink">{item.title}</h3>
                    <p className="text-sm text-ink/60 font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-pastel-purple-light/30 rounded-3xl border border-pastel-purple/20 space-y-4">
              <div className="flex items-center space-x-2 text-pastel-purple">
                <Ruler className="w-5 h-5" />
                <h4 className="font-bold text-sm">측정 가이드</h4>
              </div>
              <p className="text-xs text-ink/60 leading-relaxed">
                정확한 맞춤을 위해 목둘레, 가슴둘레, 등길이를 측정해 주세요. 
                측정 시 손가락 하나가 들어갈 정도의 여유를 두는 것이 가장 좋습니다.
                어려움이 있으시면 상담 시 상세히 도와드립니다.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl shadow-pastel-purple/5 border border-pastel-purple/10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-ink/60 uppercase tracking-widest">성함</label>
                  <input 
                    {...register('customerName')}
                    className="w-full px-4 py-3 rounded-xl border border-pastel-purple/20 focus:outline-none focus:border-pastel-purple bg-ivory/30"
                    placeholder="홍길동"
                  />
                  {errors.customerName && <p className="text-xs text-red-500">{errors.customerName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-ink/60 uppercase tracking-widest">이메일</label>
                  <input 
                    {...register('customerEmail')}
                    className="w-full px-4 py-3 rounded-xl border border-pastel-purple/20 focus:outline-none focus:border-pastel-purple bg-ivory/30"
                    placeholder="example@mail.com"
                  />
                  {errors.customerEmail && <p className="text-xs text-red-500">{errors.customerEmail.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-ink/60 uppercase tracking-widest">반려동물 이름 및 견종/묘종</label>
                <input 
                  {...register('petName')}
                  className="w-full px-4 py-3 rounded-xl border border-pastel-purple/20 focus:outline-none focus:border-pastel-purple bg-ivory/30"
                  placeholder="초코 (포메라니안)"
                />
                {errors.petName && <p className="text-xs text-red-500">{errors.petName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-ink/60 uppercase tracking-widest">상세 치수 (목, 가슴, 등길이 등)</label>
                <textarea 
                  {...register('dimensions')}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-pastel-purple/20 focus:outline-none focus:border-pastel-purple bg-ivory/30 resize-none"
                  placeholder="목둘레: 22cm, 가슴둘레: 35cm, 등길이: 25cm..."
                />
                {errors.dimensions && <p className="text-xs text-red-500">{errors.dimensions.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-ink/60 uppercase tracking-widest">추가 요청사항 (선택)</label>
                <textarea 
                  {...register('request')}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-pastel-purple/20 focus:outline-none focus:border-pastel-purple bg-ivory/30 resize-none"
                  placeholder="원하는 색상이나 특별한 디자인 요청사항이 있다면 적어주세요."
                />
              </div>

              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl text-blue-600">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  문의 접수 후 1~2일 내로 순차적으로 연락드립니다. 
                  급한 문의는 카카오톡 채널을 이용해 주세요.
                </p>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-pastel-purple text-white font-bold hover:bg-pastel-purple/90 transition-all shadow-lg shadow-pastel-purple/20 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>상담 신청하기</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
