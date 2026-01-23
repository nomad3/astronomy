{{/*
Expand the name of the chart.
*/}}
{{- define "astronomy.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "astronomy.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "astronomy.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "astronomy.labels" -}}
helm.sh/chart: {{ include "astronomy.chart" . }}
{{ include "astronomy.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "astronomy.selectorLabels" -}}
app.kubernetes.io/name: {{ include "astronomy.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Server image
*/}}
{{- define "astronomy.serverImage" -}}
{{- printf "%s/%s:%s" .Values.image.registry .Values.server.image.repository .Values.server.image.tag }}
{{- end }}

{{/*
Client image
*/}}
{{- define "astronomy.clientImage" -}}
{{- printf "%s/%s:%s" .Values.image.registry .Values.client.image.repository .Values.client.image.tag }}
{{- end }}
