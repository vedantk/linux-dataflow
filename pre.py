#!/usr/bin/python
# Generate useful information from dataflow.txt.

import re
import json
from collections import defaultdict, namedtuple

struct_rx = re.compile('.*\+\n$')

# Track usages of a struct by subsystem.
Struct = namedtuple('Struct', 'name usage')
phony = Struct('phony', defaultdict(int))

class Dataflow:
    def __init__(self):
        # Map a subsystem into a list of Struct objects.
        self.total_nr_defs = 0
        self.subsys_defs = defaultdict(list)

    def add_def(self, subsys, name):
        name = name[:-2]
        if len(name) == 1 or subsys in {"Documentation"}:
            self.struct_usage = phony
            return

        self.struct_usage = Struct(name, defaultdict(int))
        self.subsys_defs[subsys].append(self.struct_usage)
        self.total_nr_defs += 1

    def add_usage(self, subsys, count):
        count = int(count)
        self.struct_usage.usage[subsys] += count

    def finalize(self):
        # Try really hard to avoid duplicates.
        seen = set()
        for subsys in list(self.subsys_defs.keys()):
            revision = []
            for entry in self.subsys_defs[subsys]:
                if entry.name not in seen:
                    seen.add(entry.name)
                    revision.append(entry)

            if len(revision) >= 8:
                self.subsys_defs[subsys] = revision
            else:
                del self.subsys_defs[subsys]

        # Sort structs by usage frequency.
        for subsys in self.subsys_defs:
            self.subsys_defs[subsys].sort(key = lambda defn: \
                        sum(defn.usage.values()), reverse = True)
            for entry in self.subsys_defs[subsys]:
                keep = sorted(entry.usage.keys(),
                        key = lambda ss: entry.usage[ss], reverse = True)[:3]
                for key in list(entry.usage.keys()):
                    if key not in keep:
                        del entry.usage[key]

def process(path):
    with open(path, 'r') as data:
        flow = Dataflow()

        while True:
            line = data.readline() 
            if not line:
                break

            f = flow.add_def if struct_rx.match(line) else flow.add_usage
            f(*line.split(':'))

        flow.finalize()

        print('nr_defs = {0}'.format(flow.total_nr_defs))
        print('nr_subsys = {0}'.format(len(flow.subsys_defs)))

        print('data = ', end='')
        print(json.dumps(flow.subsys_defs))

if __name__ == '__main__':
    process('dataflow.txt')
