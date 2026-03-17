// Copyright The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package common

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestValidateTimezone(t *testing.T) {
	tests := []struct {
		name     string
		timezone string
		wantErr  bool
	}{
		{"empty string is valid", "", false},
		{"valid timezone America/New_York", "America/New_York", false},
		{"valid timezone Europe/London", "Europe/London", false},
		{"valid timezone Asia/Tokyo", "Asia/Tokyo", false},
		{"invalid timezone name", "Invalid/Zone", true},
		{"random string", "mars-timezone", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateTimezone(tt.timezone)
			if tt.wantErr {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tt.timezone)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}
