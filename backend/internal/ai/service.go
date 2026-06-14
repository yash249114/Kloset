package ai

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/generative-ai-go/genai"
	"github.com/kloset/backend/internal/config"
	"google.golang.org/api/option"
)

// Service handles AI-powered features using Gemini
type Service struct {
	client *genai.Client
	model  string
}

// ChatRequest represents a user's chat message
type ChatRequest struct {
	Message string   `json:"message" validate:"required"`
	History []ChatMessage `json:"history"`
}

// ChatMessage represents a single message in the conversation
type ChatMessage struct {
	Role    string `json:"role"` // "user" or "model"
	Content string `json:"content"`
}

// ChatResponse represents the AI's response
type ChatResponse struct {
	Reply string `json:"reply"`
}

// DescribeRequest represents a request to generate an AI description
type DescribeRequest struct {
	Title    string   `json:"title"`
	Category string   `json:"category"`
	Fabric   string   `json:"fabric"`
	Colors   []string `json:"colors"`
	Occasion []string `json:"occasion"`
}

// DescribeResponse represents the AI-generated description
type DescribeResponse struct {
	Description string `json:"description"`
}

// RecommendRequest represents a request to get styling recommendations
type RecommendRequest struct {
	Occasion   string `json:"occasion"`
	Color      string `json:"color"`
	Size       string `json:"size"`
	Gender     string `json:"gender"`
	StyleNotes string `json:"style_notes"`
}

// RecommendResponse represents recommended outfit details
type RecommendResponse struct {
	Recommendations []string `json:"recommendations"`
	Reasoning       string   `json:"reasoning"`
}

// NewService creates a new AI service
func NewService(cfg *config.Config) (*Service, error) {
	if cfg.AI.APIKey == "" {
		return &Service{client: nil, model: cfg.AI.Model}, nil
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(cfg.AI.APIKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create Gemini client: %w", err)
	}

	return &Service{
		client: client,
		model:  cfg.AI.Model,
	}, nil
}

// Chat handles a conversational AI interaction
func (s *Service) Chat(req *ChatRequest) (*ChatResponse, error) {
	if s.client == nil {
		return s.fallbackChat(req)
	}

	ctx := context.Background()
	model := s.client.GenerativeModel(s.model)

	// Configure the model for fashion assistance
	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{
			genai.Text(`You are Kloset AI Stylist — a premium fashion rental concierge for the Indian luxury fashion marketplace "Kloset". 

Your expertise:
- Indian designer fashion (lehengas, sarees, sherwanis, anarkalis, gowns)
- Occasion-based outfit recommendations (weddings, receptions, festivals, parties)
- Body-type and color recommendations
- Rental policies, sizing guidance, and care instructions
- Sustainable fashion and the benefits of renting over buying

Guidelines:
- Be warm, professional, and fashion-forward
- Give specific outfit recommendations when asked
- Reference Indian fashion trends and designers
- Keep responses concise but helpful (2-3 paragraphs max)
- Use occasional Hindi/fashion terms naturally
- If asked about non-fashion topics, gently redirect to fashion advice
- Never make up specific product listings or prices`),
		},
	}

	// Build conversation history
	cs := model.StartChat()
	for _, msg := range req.History {
		role := msg.Role
		if role == "bot" || role == "model" {
			role = "model"
		}
		cs.History = append(cs.History, &genai.Content{
			Role:  role,
			Parts: []genai.Part{genai.Text(msg.Content)},
		})
	}

	// Send current message
	resp, err := cs.SendMessage(ctx, genai.Text(req.Message))
	if err != nil {
		return s.fallbackChat(req)
	}

	// Extract text from response
	var reply strings.Builder
	for _, cand := range resp.Candidates {
		if cand.Content != nil {
			for _, part := range cand.Content.Parts {
				reply.WriteString(fmt.Sprintf("%v", part))
			}
		}
	}

	if reply.Len() == 0 {
		return s.fallbackChat(req)
	}

	return &ChatResponse{Reply: reply.String()}, nil
}

// Describe generates an AI description for an outfit
func (s *Service) Describe(req *DescribeRequest) (*DescribeResponse, error) {
	if s.client == nil {
		return &DescribeResponse{
			Description: fmt.Sprintf("A stunning %s %s perfect for any special occasion.", req.Category, req.Title),
		}, nil
	}

	ctx := context.Background()
	model := s.client.GenerativeModel(s.model)

	prompt := fmt.Sprintf(
		`Write a luxurious, compelling 2-sentence product description for a fashion rental listing:
Title: %s
Category: %s
Fabric: %s
Colors: %s
Occasions: %s

Write in an elegant, editorial tone suitable for a premium fashion marketplace. Focus on the craftsmanship, silhouette, and how it makes the wearer feel.`,
		req.Title, req.Category, req.Fabric,
		strings.Join(req.Colors, ", "),
		strings.Join(req.Occasion, ", "),
	)

	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return &DescribeResponse{
			Description: fmt.Sprintf("A stunning %s %s perfect for any special occasion.", req.Category, req.Title),
		}, nil
	}

	var desc strings.Builder
	for _, cand := range resp.Candidates {
		if cand.Content != nil {
			for _, part := range cand.Content.Parts {
				desc.WriteString(fmt.Sprintf("%v", part))
			}
		}
	}

	return &DescribeResponse{Description: desc.String()}, nil
}

// Recommend finds the best matching outfits using AI advice
func (s *Service) Recommend(req *RecommendRequest) (*RecommendResponse, error) {
	fallback := &RecommendResponse{
		Recommendations: []string{},
		Reasoning:       "Select the perfect " + req.Occasion + " outfit from our collection.",
	}

	if s.client == nil {
		return fallback, nil
	}

	ctx := context.Background()
	model := s.client.GenerativeModel(s.model)

	prompt := fmt.Sprintf(
		`You are a personal AI Stylist for Kloset luxury fashion rentals.
The user is looking for styling recommendations:
Occasion: %s
Color preference: %s
Size: %s
Gender: %s
Style notes: %s

Give a brief styling advice (1-2 sentences) on how they should style this look.`,
		req.Occasion, req.Color, req.Size, req.Gender, req.StyleNotes,
	)

	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return fallback, nil
	}

	var reasoning strings.Builder
	for _, cand := range resp.Candidates {
		if cand.Content != nil {
			for _, part := range cand.Content.Parts {
				reasoning.WriteString(fmt.Sprintf("%v", part))
			}
		}
	}

	return &RecommendResponse{
		Recommendations: []string{},
		Reasoning:       reasoning.String(),
	}, nil
}

// fallbackChat provides keyword-based responses when Gemini is unavailable
func (s *Service) fallbackChat(req *ChatRequest) (*ChatResponse, error) {
	lower := strings.ToLower(req.Message)

	responses := map[string]string{
		"cancel":      "🌸 **Cancellation Policy**: Free cancellation up to 7 days before your rental pickup date. Within 7 days, a 50% cancellation fee applies. You can cancel directly from your renter dashboard.",
		"return":      "📦 **Returns**: We handle all return pickups! Repack the outfit in the original cover. Our courier will collect it the morning after your rental ends.",
		"refund":      "💰 **Refunds**: Security deposits are released within 72 hours of quality review. Standard bank transfers credit in 2-5 business days.",
		"damage":      "🛡️ **Damage Protection**: Normal wear and minor stains are covered. For significant damage, part of the security deposit may be withheld. Consider adding damage protection at checkout.",
		"size":        "👗 **Sizing**: If the outfit doesn't fit, contact us immediately. We can dispatch a replacement or issue a full rental credit.",
		"wedding":     "💍 **Wedding Outfits**: Browse our curated bridal and wedding collection including lehengas, sarees, and sherwanis. Our AI stylist can recommend outfits based on your wedding theme and color palette!",
		"recommend":   "✨ **Style Recommendations**: Tell me about your upcoming event — the occasion, venue, season, and your style preferences. I'll suggest the perfect outfit from our collection!",
		"price":       "💎 **Pricing**: Rental prices start from ₹1,500/day for designer wear that retails at ₹50,000+. You save up to 80% compared to buying. Security deposits are 100% refundable.",
		"lehenga":     "👑 **Lehengas**: Our most popular category! We have bridal, reception, and festive lehengas from top designers. Would you like me to recommend styles based on your body type or occasion?",
		"saree":       "🌺 **Sarees**: From Banarasi silks to modern drapes, our saree collection covers every occasion. Tell me your event and I'll suggest the perfect weave!",
	}

	for keyword, response := range responses {
		if strings.Contains(lower, keyword) {
			return &ChatResponse{Reply: response}, nil
		}
	}

	return &ChatResponse{
		Reply: "I'm your Kloset AI Stylist! I can help you with:\n\n• **Outfit recommendations** for any occasion\n• **Sizing and fit** guidance\n• **Rental policies** (cancellation, returns, refunds)\n• **Damage protection** information\n• **Wedding styling** advice\n\nWhat would you like to know?",
	}, nil
}

// Close cleans up the AI service resources
func (s *Service) Close() {
	if s.client != nil {
		s.client.Close()
	}
}
