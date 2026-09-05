import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30; // max duration 30 seconds

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    let productContext = '';
    let policyContext = '';
    try {
      const apiPrefix = (process.env.API_URL ?? 'http://127.0.0.1:8080').replace('localhost', '127.0.0.1');
      const [productRes, policyRes] = await Promise.all([
        fetch(`${apiPrefix}/api/products`, { cache: 'no-store' }),
        fetch(`${apiPrefix}/api/content/policies`, { cache: 'no-store' })
      ]);

      if (productRes.ok) {
        const products = await productRes.json();
        const productList = products.map((p: any) => {
          let line = `- ${p.name}: Giá cơ bản ${p.basePrice.toLocaleString('vi-VN')} VND`;
          if (p.originalPrice) line += ` (Giá gốc: ${p.originalPrice.toLocaleString('vi-VN')} VND)`;
          if (p.storages && p.storages.length > 0) {
            const variants = p.storages.map((s: any) => `${s.name} (+${s.priceOffset.toLocaleString('vi-VN')} VND)`).join(', ');
            line += ` | Các bản nâng cấp dung lượng: ${variants}`;
          }
          return line;
        }).join('\n');
        productContext = `\nDanh sách sản phẩm chi tiết hiện đang bán tại PulseTech:\n${productList}\n`;
      }

      if (policyRes.ok) {
        const policies = await policyRes.json();
        const policyList = policies.map((p: any) => `- ${p.title}: ${p.contentHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}`).join('\n');
        policyContext = `\nCác chính sách và quy định của PulseTech:\n${policyList}\n`;
      }
    } catch (e) {
      console.error('Failed to fetch context for AI', e);
    }

    const mappedMessages = messages.map((m: any) => {
      if (m.parts && m.parts.length > 0 && !m.content) {
        return { ...m, content: m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join(''), parts: undefined };
      }
      return m;
    });

    const systemPrompt = `Bạn là trợ lý ảo AI chính thức của PulseTech - một hệ thống bán lẻ điện thoại di động, máy tính bảng và phụ kiện chính hãng hàng đầu tại Việt Nam.
Vai trò của bạn:
- Hỗ trợ khách hàng nhiệt tình, lịch sự, và chuyên nghiệp.
- Tư vấn về các sản phẩm công nghệ (iPhone, Samsung, Xiaomi, v.v.).
- Giải đáp thắc mắc về chính sách bảo hành, giao hàng, đổi trả.

Một số thông tin về PulseTech (Bạn HÃY sử dụng dữ liệu này để trả lời chính xác các câu hỏi về chính sách):${policyContext}
Hãy trả lời ngắn gọn, súc tích và tập trung vào việc giúp khách hàng mua sắm tốt nhất. Tuyệt đối KHÔNG sử dụng ký tự Markdown như dấu sao (*) hoặc (**) để in đậm hay gạch đầu dòng, chỉ dùng văn bản thuần túy (plain text) và dấu gạch ngang (-) nếu cần liệt kê. Nếu khách hỏi giá, hãy dựa vào danh sách sản phẩm được cung cấp bên dưới để trả lời chính xác. Để tính giá cho một bản nâng cấp dung lượng, hãy lấy Giá cơ bản + mức giá nâng cấp tương ứng. Không bịa đặt sản phẩm hoàn toàn không có trong danh sách.${productContext}`;

    const result = await streamText({
      model: google('gemini-3.5-flash'),
      system: systemPrompt,
      messages: mappedMessages,
    });

    return result.toUIMessageStreamResponse ? result.toUIMessageStreamResponse() : result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: error.message || error.toString() }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
