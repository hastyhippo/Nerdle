#include<bits/stdc++.h>
#include <fstream>
using namespace std;

vector<vector<int>> all_words;
vector<string> all_strings;
void Check() { 
    char c;
    vector<int> final(5, -1);
    vector<int> unincluded; 
    vector<int> almost;
    cout << "\n Total word count: " << all_strings.size() << "\n";

    cout << "c: correct | d: discard | a: almost | - prune: ";

    while (cin >> c) {
        if (c == '-') {
            vector<string> new_strings;
            vector<vector<int>> new_words;
            for (int i = 0; i < all_words.size(); i++) {
                bool works = true;
                bool banned = false;

                // discard all words that use unincluded letters
                for (auto a : unincluded) {
                    if (all_words[i][a-'a'] > 0) {
                        banned = true;
                        break;
                    }
                }
                if (banned) continue;

                // discard all words which don't match yellows
                for (auto a : almost) {
                    if (all_words[i][a-'a'] <= 0) {
                        banned = true;
                    }
                }
                if (banned) continue;

                // discard all words that don't match greens
                for (int j= 0 ;j < 5; j++) {
                    if (final[j] == -1) continue;
                    if (final[j] != all_strings[i][j] - 'a') {
                        banned = true;
                    }
                }

                if (!banned) {
                    new_strings.push_back(all_strings[i]);
                    new_words.push_back(vector<int>(all_words[i]));
                }
            }
            all_strings = new_strings;
            all_words = new_words;



            for (auto a : all_strings) {
                cout << a << "\n";
            }
            cout << "\n Total word count: " << all_strings.size() << "\n";
            continue;
        }

        char c1;
        cout << "What character: ";
        cin >> c1;

        if (c == 'c') {
            int n;
            cout << "What position: ";
            cin >> n;
            final[n] = c1 - 'a';
        } else if (c == 'a') {
            almost.push_back(c1);
        }else if (c == 'd') {
            unincluded.push_back(c1);
        } else {
            cout << "Invalid letter\n";
        }
        cout << "c: correct | d: discard | a: almost | - prune: ";

    }
}

int main() {
    ifstream inFile;
    inFile.open("../components/test-words.txt");
    if (!inFile) {
        cerr << "Unable to open wordle-bank";
        exit(1);
    }
    string s;
    while(inFile >> s) {
        all_strings.push_back(s);

        vector<int> v(26);
        for (auto a : s) {
            v[a-'a']++;
        }
        all_words.push_back(v);
    }
    Check();
}