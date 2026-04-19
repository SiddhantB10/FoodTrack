export interface ModelInfoResponse {
  modelVersion: string
  modelType: string
  status: string
  features: string[]
  accuracy: number
  meanAbsoluteError: number
  r2Score: number
  trainingDataSize: number
  lastUpdated: string
  using_real_model: boolean
}

export interface PredictRequest {
  distance: number
  traffic: 'low' | 'medium' | 'high'
  weather: 'clear' | 'rainy' | 'stormy'
  prepTime: number
  orderSize: 'small' | 'medium' | 'large'
}

export interface PredictResponse {
  estimatedTime: number
  confidence: number
  factors: {
    distance: number
    traffic: string
    weather: string
    prepTime: number
    orderSize: string
  }
  modelVersion: string
  predictionId: string
  modelInfo: {
    status: string
    accuracy: number | string
    using_real_model: boolean
  }
}

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
}

export async function fetchModelInfo(): Promise<ModelInfoResponse | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/model-info`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as ModelInfoResponse
    return data
  } catch {
    return null
  }
}

export async function predictDelivery(input: PredictRequest): Promise<PredictResponse> {
  const response = await fetch(`${getApiBaseUrl()}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Prediction request failed')
  }

  return (await response.json()) as PredictResponse
}
